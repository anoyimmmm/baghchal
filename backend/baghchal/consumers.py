from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .core.gameState import game_states
from .core.utils import get_initial_game_state, update_game_state
# from board import process_move, get_new_board

class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = "game_room"
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        self.accept()
        print("websocket connected")

        if self.room_name not in game_states:
            game_states[self.room_name] = get_initial_game_state()
        
        self.send(text_data=json.dumps({
                    "message": {
                        "type": "init",
                        "board": game_states[self.room_name]
                    }
                }))
        

    def receive(self, text_data):
        move = json.loads(text_data)['message']
        print(f"text data received: {move}")

        new_game_state = update_game_state(self.room_name, move)
        
        event = {
            "type" :"send_board",
            'board': new_game_state
        }
        async_to_sync(self.channel_layer.group_send)(self.room_name, event)

    def send_board(self, event):
        self.send(text_data=json.dumps({
            "message":{
                "type": "update",
                'board': event['board']
            }
            }))
        
        
    def disconnect(self, message):
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
        print("websocket closed")
