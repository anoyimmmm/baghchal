from .game_state import game_boards
def get_initial_board():
    """ returns initial state of baghchal board : 4 tigers at the 4 corners"""
    initial_board = {
        "0-0": "tiger",
        "0-4": "tiger",
        "4-0": "tiger",
        "4-4": "tiger",
    }
    return initial_board

def process_move(room_name, move):

    # this is  sample of move
    # {'moveType': 'place', 'currentPlayer': 'goat', 'fromKey': None, 'toKey': '1-4'}
    board = game_boards[room_name]
    if not isvalid(board, move):
        return None
    if move['moveType'] == 'place' and move['currentPlayer'] == 'goat':
        board[move['toKey']] = move['currentPlayer']
    elif move["moveType"] == 'displace':
        piece = board.pop(move['fromKey'])
        board[move['toKey']] = piece
    elif move["moveType"] == 'capture':
        piece = board.pop(move['fromKey'])
        board[move['toKey']] = piece
        #  remove the goat in the middle
        midKey = get_mid_key(move['fromKey'], move['toKey'])
        if board[midKey] == 'goat':
            board.pop(midKey)
    return board




def get_mid_key(fromKey, toKey):
    fromRow, fromCol = map(int, fromKey.split('-'))
    toRow, toCol = map(int, toKey.split('-'))
    midRow = (fromRow + toRow) // 2
    midCol = (fromCol + toCol) // 2
    midKey = f"{midRow}-{midCol}"
    return midKey

def isvalid(board,move):
    # placing is only possible in empty place
    if move['moveType'] == 'place':
        return board.get(move['toKey']) is None
    # fromkey should hav correct piece and tokey should be empty
    if move['moveType'] in ('displace', 'capture'):
        return board.get(move['fromKey']) == move['currentPlayer'] and board.get(move['toKey']) is None
    return False
