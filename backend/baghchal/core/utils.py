from .gameState import game_states

def get_initial_game_state():
    """Returns the initial state of BaghChal game."""
    return {
        "board": {
            "0-0": "tiger",
            "0-4": "tiger",
            "4-0": "tiger",
            "4-4": "tiger"
        },
        "status": "ongoing",   # can be 'ongoing', 'goat_won', 'tiger_won'
        "currentPlayer": "goat",
        "phase": "placement",  # can be displacement',  'placement
        "unusedGoat": 20,
        "deadGoatCount": 0,
        "status": "waiting",   # can be 'waiting', 'ongoing', 'over'
        "winner": None
    }

def update_game_state(room_name, move):
    """ Updates the game state based on the new move """
    game_state = game_states[room_name]
    board = game_state["board"]
    current_player = game_state["currentPlayer"]

    if not isvalid_move(game_state, move):
        return None

    move_type = move["moveType"]
    from_key = move.get("fromKey")
    to_key = move.get("toKey")

    if move_type == "place":
        board[to_key] = "goat"
        game_state["unusedGoat"] -= 1
        if game_state["unusedGoat"] == 0:
            game_state["phase"] = "displacement"

    elif move_type == "displace":
        piece = board.pop(from_key)
        board[to_key] = piece

    elif move_type == "capture":
        piece = board.pop(from_key)
        board[to_key] = piece
        mid_key = get_mid_key(from_key, to_key)
        if board.get(mid_key) == "goat":
            board.pop(mid_key)
            game_state["deadGoatCount"] += 1

    # Switch player
    game_state["currentPlayer"] = "tiger" if current_player == "goat" else "goat"

    check_game_over(game_state)

    return game_state

def get_mid_key(from_key, to_key):
    from_row, from_col = map(int, from_key.split('-'))
    to_row, to_col = map(int, to_key.split('-'))
    mid_row = (from_row + to_row) // 2
    mid_col = (from_col + to_col) // 2
    return f"{mid_row}-{mid_col}"

def isvalid_move(game_state, move):
    board = game_state["board"]
    move_type = move["moveType"]
    from_key = move.get("fromKey")
    to_key = move.get("toKey")
    current_player = move.get("currentPlayer")

    if move_type == "place":
        return to_key not in board

    if move_type in ("displace", "capture"):
        return board.get(from_key) == current_player and to_key not in board

    return False

def check_game_over(game_state):
    board = game_state["board"]
    dead_goats = game_state["deadGoatCount"]

    # Tiger win condition
    if dead_goats >= 5:
        game_state["status"] = "over"
        game_state["winner"] = "tiger"
        print("tiger won!!!")
        return 

    # Goat win condition
    tigers = [position for position, piece in board.items() if piece == "tiger"]
    if all(is_blocked(pos, board) for pos in tigers):
        game_state["status"] = "over"
        game_state["winner"] = "goat"
        print("goat won!!!")
        return True

    return False

def is_blocked(pos, board):
    possible_moves = get_possible_tiger_moves(pos)  # you define this
    for move in possible_moves:
        if move not in board: # even if one move is empty tiger is not blocked
            return False
    if can_capture(pos, board):
        return False # not blocked until it can capture
    return True

def get_possible_tiger_moves(position):
    move_connections = {
        # Row 0
        "0-0": ["0-1", "1-0"],
        "0-1": ["0-0", "0-2"],
        "0-2": ["0-1", "0-3", "1-2"],  # Only connects to center of row 1
        "0-3": ["0-2", "0-4"],
        "0-4": ["0-3", "1-4"],

        # Row 1
        "1-0": ["0-0", "1-1", "2-0"],
        "1-1": ["1-0", "1-2", "2-1"],
        "1-2": ["0-2", "1-1", "1-3", "2-2"],  # Center point connects to 0-2 and 2-2
        "1-3": ["1-2", "1-4", "2-3"],
        "1-4": ["0-4", "1-3", "2-4"],

        # Row 2 (center row)
        "2-0": ["1-0", "2-1", "3-0"],
        "2-1": ["2-0", "2-2", "3-1"],
        "2-2": ["1-2", "2-1", "2-3", "3-2"],  # Center point - key connection hub
        "2-3": ["2-2", "2-4", "3-3"],
        "2-4": ["1-4", "2-3", "3-4"],

        # Row 3
        "3-0": ["2-0", "3-1", "4-0"],
        "3-1": ["3-0", "3-2", "4-1"],
        "3-2": ["2-2", "3-1", "3-3", "4-2"],  # Center point connects to 2-2 and 4-2
        "3-3": ["3-2", "3-4", "4-3"],
        "3-4": ["2-4", "3-3", "4-4"],

        # Row 4
        "4-0": ["3-0", "4-1"],
        "4-1": ["4-0", "4-2"],
        "4-2": ["3-2", "4-1", "4-3"],  # Only connects to center of row 3
        "4-3": ["4-2", "4-4"],
        "4-4": ["3-4", "4-3"],
    }
    return move_connections[position]
    

def can_capture(pos, board):
    capture_connections = {
        # Row 0
        "0-0": ["0-2"],  # Can only capture 0-1 to land on 0-2
        "0-1": [],       # No valid captures (can't jump over adjacent pieces)
        "0-2": ["0-0", "0-4", "2-2"],  # Can capture 0-1→0-0, 0-3→0-4, 1-2→2-2
        "0-3": [],       # No valid captures
        "0-4": ["0-2"],  # Can capture 0-3 to land on 0-2

        # Row 1
        "1-0": ["3-0"],  # Can capture 2-0 to land on 3-0
        "1-1": ["3-1"],  # Can capture 2-1 to land on 3-1
        "1-2": ["1-0", "1-4", "3-2"],  # Horizontal captures and vertical through center
        "1-3": ["3-3"],  # Can capture 2-3 to land on 3-3
        "1-4": ["3-4"],  # Can capture 2-4 to land on 3-4

        # Row 2 (center row)
        "2-0": ["4-0"],  # Can capture 3-0 to land on 4-0
        "2-1": ["4-1"],  # Can capture 3-1 to land on 4-1
        "2-2": ["0-2", "4-2", "2-0", "2-4"],  # Vertical captures and horizontal
        "2-3": ["4-3"],  # Can capture 3-3 to land on 4-3
        "2-4": ["4-4"],  # Can capture 3-4 to land on 4-4

        # Row 3
        "3-0": ["1-0"],  # Can capture 2-0 to land on 1-0
        "3-1": ["1-1"],  # Can capture 2-1 to land on 1-1
        "3-2": ["1-2", "3-0", "3-4"],  # Vertical and horizontal captures
        "3-3": ["1-3"],  # Can capture 2-3 to land on 1-3
        "3-4": ["1-4"],  # Can capture 2-4 to land on 1-4

        # Row 4
        "4-0": ["2-0"],  # Can capture 3-0 to land on 2-0
        "4-1": ["2-1"],  # Can capture 3-1 to land on 2-1
        "4-2": ["2-2", "4-0", "4-4"],  # Vertical capture and horizontal
        "4-3": ["2-3"],  # Can capture 3-3 to land on 2-3
        "4-4": ["2-4"],  # Can capture 3-4 to land on 2-4
    }
    capture_positions = capture_connections[pos]
    # for each capture position:
    #     if the position is empty and middle piece is goat:
    # return true else return false
    for cap_pos in capture_positions:
        if board.get(cap_pos) == None and board.get(get_mid_key(pos, cap_pos)) == 'goat':
            return True
    return False

    
