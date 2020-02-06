class ComprehensionException(Exception):
    """
    A base exception we can use when sub-classing our own custom
    exceptions.  This allows us to except all of our own exceptions
    if that behavior is every desirable.
    """
    pass
