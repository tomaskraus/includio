
import sys


def maze_room_count(maze):
    """
    >>> maze_room_count((2, 3))
    6
    """
    return maze[0] * maze[1]


ALL_DIRECTIONS = [1,2,3,4]
#  1
# 4 2
#  3
def check_direction(direction):
    if direction not in [1,2,3,4]:
         raise ValueError(f'Invalid direction: [{direction}]')

#< example1    -- this is example of includio part in python
def direction_name(direction):
    """
    >>> direction_name(2)
    '>'
    """
    names = ['', '^', '>', 'v', '<']
    check_direction(direction)
    return names[direction]
#<  

def valid_room(room, maze):
    """
    >>> valid_room((0, 0), (3, 2))
    True
    >>> valid_room((1, 0), (3, 2))
    True
    >>> valid_room((2, 0), (3, 2))
    True
    >>> valid_room((3, 0), (3, 2))
    False
    >>> valid_room((-1, 0), (3, 2))
    False

    >>> valid_room((0, 1), (3, 2))
    True
    >>> valid_room((0, 2), (3, 2))
    False
    >>> valid_room((0, -1), (3, 2))
    False
    
    >>> valid_room((1, 1), (3, 2))
    True
    >>> valid_room((2, 1), (3, 2))
    True
    >>> valid_room((-1, -1), (3, 2))
    False
    >>> valid_room((3, 2), (3, 2))
    False
    """
    if room[0] < 0 or room[0] >= maze[0]:
        return False
    if room[1] < 0 or room[1] >= maze[1]:
        return False
    return True


def valid_maze(maze):
    """
    >>> valid_maze((0, 1))
    False
    >>> valid_maze((2, -1))
    False
    >>> valid_maze((1, 4))
    True
    """
    return maze[0] > 0 and maze[1] > 0


# Returns the next room. The same room, if a move in that direction is not possible. 
def move(direction, from_room, maze):
    """
    >>> move(1, (1,0), (4,4))
    (1, 0)
    >>> move(1, (1,1), (4,4))
    (1, 0)
    """
    check_direction(direction)
    new_room = from_room
    if direction == 1:
        new_room = from_room[0], from_room[1] - 1
    elif direction == 3:
        new_room = from_room[0], from_room[1] + 1
    elif direction == 2:
        new_room = from_room[0] + 1, from_room[1]
    else:
        new_room = from_room[0] - 1, from_room[1]
    if valid_room(new_room, maze):
        return new_room
    return from_room
    

def can_move(direction, from_room, maze):
    """
    >>> can_move(1, (1, 1), (3, 3))
    True
    >>> can_move(3, (1, 1), (3, 2))
    False
    >>> can_move(4, (0, 1), (3, 3))
    False
    """
    return move(direction, from_room, maze) != from_room

#< possible_directions
def possible_directions(from_room, maze):
    """
    >>> possible_directions((0, 0), (1, 1))
    []
    >>> possible_directions((0, 0), (2, 2))
    [2, 3]
    >>> possible_directions((1, 0), (2, 2))
    [3, 4]
    >>> possible_directions((1, 1), (3, 3))
    [1, 2, 3, 4]
    >>> possible_directions((1, 1), (2, 2))
    [1, 4]
    >>> possible_directions((0, 1), (2, 2))
    [1, 2]
    >>> possible_directions((2, 1), (3, 3))
    [1, 3, 4]
    """
    return list(filter(lambda d: can_move(d, from_room, maze), list(ALL_DIRECTIONS)))    
#<

moves_computed = 0
def resume():
    global moves_computed
    print(f'Total moves computed: {moves_computed}')

def visit_next(room, destination_room, maze, visited_rooms, moves):
    global moves_computed
    if room == destination_room and len(visited_rooms) == maze_room_count(maze) - 1:
        print(moves)
        resume()
        sys.exit(0)
    for next_direction in list(possible_directions(room, maze)):
        next_room = move(next_direction, room, maze)
        if next_room not in visited_rooms:
            moves_computed += 1
            visit_next(next_room, destination_room, maze, visited_rooms + [room], moves + [direction_name(next_direction)])
        

def search_path(start_room, destination_room, maze):
    if not valid_maze(maze):
        print(f'Invalid maze: {maze}')
    elif not valid_room(start_room, maze):
        print(f'Invalid start input {start_room} for maze {maze}')
    elif not valid_room(destination_room, maze):
        print(f'Invalid destination input {destination_room} for maze {maze}')
    
    else:
        visit_next(start_room, destination_room, maze, [], [])

    
if __name__ == "__main__":
    search_path((0,0), (3, 2), (4,4))
    resume()
    

