
""" INPUTTEXT is the message to be encrypted.
    Shift characters N values in direction D
    left for -1 and right for +1. """
def encrypt(inputText, n, d):
    return _reverse_chars(_shift_chars(inputText, d*n))

""" Shift the characters from INPUTTEXT by N characters
    (N > 1). """
def _shift_chars(inputText, n):
    cipherText = ""
    for c in inputText:
        cipherText += chr(((ord(c) + n - 34) % 93) + 34)
    return cipherText

""" Reverse the order of the characters from INPUTTEXT. """
def _reverse_chars(inputText):
    reversedText = ""
    for c in inputText:
        reversedText = c + reversedText
    return reversedText