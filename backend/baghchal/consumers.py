from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs
from .utils import is_valid_uuid
from .core.gameState import game_states
from .core.utils import get_initial_game_state, update_game_state, cleanup_game_states
import random
import uuid


class GameConsumer(WebsocketConsumer):
    def connect(self):

        cleanup_game_states(game_states)
        query = parse_qs(self.scope["query_string"].decode())

        self.game_id = query.get("game_id", [None])[0]
        self.mode = query.get("mode", [None])[0]
        self.play_as = query.get("play_as", [None])[0]
        self.username = query.get("username", [None])[0]

        print(
            f"Connection attempt - Mode: {self.mode}, Game ID: {self.game_id}, Play as: {self.play_as}"
        )

        # Validate connection parameters
        if not self.mode:
            print("Error: No mode specified")
            self.close(code=4000)
            return

        if self.mode != "quick" and not is_valid_uuid(self.game_id):
            print("Error: Invalid game ID for non-quick mode")
            self.close(code=4000)
            return

        self.accept()
        print("WebSocket connection accepted")

        # Handle different connection
        try:
            self.handle_player_join()
        except Exception as e:
            print(f"Error in handle_player_join: {e}")
            self.close(code=4003)

    def handle_player_join(self):

        if self.mode == "create":
            # Set room group name for create mode
            self.room_group_name = f"game_{self.game_id}"
            if self.room_group_name in game_states:
                print("Error: Game already exists")
                self.close(code=4001)
                return
            game_states[self.room_group_name] = get_initial_game_state()
            print(f"Created new game: {self.room_group_name}")

        elif self.mode == "join":
            self.room_group_name = f"game_{self.game_id}"
            game_to_join = game_states.get(self.room_group_name)

            if (
                not game_to_join
                or game_to_join.get("status") != "waiting"
                or self.username in game_to_join.get("player").values()
            ):
                print("Error: Game not available for joining")
                self.close(code=4002)
                return
            print(f"Joined existing game: {self.room_group_name}")

        elif self.mode == "quick":
            # get a list of games whose status is waiting and user is not already a player
            waiting_games = [
                (k, v)
                for k, v in game_states.items()
                if v.get("status") == "waiting"
                and self.username not in v["player"].values()
            ]
            if waiting_games:
                self.room_group_name = random.choice(waiting_games)[0]
                print(f"Joined waiting game: {self.room_group_name}")
            else:
                # Create new game for quick mode
                new_game_id = str(uuid.uuid4())
                self.room_group_name = f"game_{new_game_id}"
                game_states[self.room_group_name] = get_initial_game_state()
                print(f"Created new quick game: {self.room_group_name}")

        elif self.mode == "rejoin":
            # rejoin only if the player joined the game once
            self.room_group_name = f"game_{self.game_id}"
            game_state = game_states.get(self.room_group_name)

            if not game_state:
                # Game doesn't exist
                self.close(code=4000)
                return
            for k, v in game_state.get("player").items():
                # if already has a role set the player for that role
                if v == self.username:
                    self.play_as = k
                    break
            else:  # if User not part of the game
                self.close(code=4000)
                return

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.send_initial_game_state()

    def send_initial_game_state(self):
        # Send initial game state to the connected player
        try:
            initial_state = game_states[self.room_group_name]
            # add game_id of the game inside itself
            initial_state["game_id"] = self.room_group_name
            # if play_as is specified assign to that type
            if self.play_as:
                initial_state["player"][self.play_as] = self.username
            else:
                # Assign user to the first available player slot
                for k, v in initial_state["player"].items():
                    if not v:
                        initial_state["player"][k] = self.username
                        # After assigning, check if all slots are now filled
                        if (
                            all(initial_state["player"].values())
                            and initial_state["status"] == "waiting"
                        ):
                            initial_state["status"] = "ongoing"
                        break

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "send_game_state",
                    "game_state": initial_state,
                },
            )
            print(f"Sent initial game state to player")

        except Exception as e:
            print(f"Error sending initial state: {e}")

    def receive(self, text_data):
        try:
            move = json.loads(text_data)
            if not hasattr(self, "room_group_name"):
                print("Error: No room group name set")
                return

            new_game_state = update_game_state(self.room_group_name, move)
            if not new_game_state:
                self.send(
                    text_data=json.dumps(
                        {"message": {"type": "error", "error": "Invalid move"}}
                    )
                )
                return

            # Broadcast updated state to all players in the game
            event = {"type": "send_game_state", "game_state": new_game_state}
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, event)

        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error processing message: {e}")
            self.send(
                text_data=json.dumps(
                    {"message": {"type": "error", "error": "Invalid message format"}}
                )
            )

    def send_game_state(self, event):
        """Handle group message to send game state update"""
        try:
            self.send(
                text_data=json.dumps(
                    {"message": {"type": "update", "game_state": event["game_state"]}}
                )
            )
        except Exception as e:
            print(f"Error sending game state: {e}")

    def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")

        # Leave room group
        if hasattr(self, "room_group_name"):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name, self.channel_name
            )
