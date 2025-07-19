from channels.generic.websocket import WebsocketConsumer
import json
# from board import process_move, get_new_board

class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        # send a new board layout to the client
        print("websocket connected")

    def disconnect(self, message):
        print("websocket closed")

    def receive(self, text_data):
        move = json.loads(text_data)['message']
        print(f"text data received: {move}")
        # >> text data received: {'moveType': 'place', 'currentPlayer': 'goat', 'fromKey': None, 'toKey': '0-3'}
        # new_board = process_move(move)
        # print(new_board)
        # echo the message back
        # self.send(new_board)
        self.send(json.dumps(move))