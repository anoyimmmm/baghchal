import uuid

def is_valid_uuid(uuid_string):
    """
    Checks if a given string is a valid UUID.

    Args:
        uuid_string: The string to be validated.

    Returns:
        True if the string is a valid UUID, False otherwise.
    """
    try:
        uuid.UUID(str(uuid_string))
        return True
    except ValueError:
        return False
