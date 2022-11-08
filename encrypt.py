
def shiftCharacters(text, N, D):
    
    #create ascii_values array to hold text converted to ascii codes
    ascii_values = []
    
    #encryptedText to return
    encryptedText = []
    
    if(D == -1):
        #left shift
        
        #convert each character to ascii and store in ascii_values
        for character in text:
            ascii_values.append(ord(character))
        
        #shift each character by N
        char_index = 0
        for character in ascii_values:
            if((character - N) < 34):
                ascii_values[char_index] = ((character - N) + 93)           
            else:
                ascii_values[char_index] = character - N
            char_index += 1

        #convert back to text
        for character in ascii_values:
            encryptedText.append(chr(character))
        
        return ''.join([str(char) for char in encryptedText])


    elif(D == 1):
        #right shift
        
        #convert each character to ascii and store in ascii_values
        for character in text:
            ascii_values.append(ord(character))
        
        #shift each character by N
        char_index = 0
        for character in ascii_values:
            if((character + N) > 126):
                ascii_values[char_index] = ((character + N) % 126) + 33           
            else:
                ascii_values[char_index] = character + N
            char_index += 1

        #convert back to text
        for character in ascii_values:
            encryptedText.append(chr(character))
        
        return ''.join([str(char) for char in encryptedText])

    else:
        return "shift was invalid"

def encrypt(inputText, N, D):
    reversedText = inputText[::-1]
    return(shiftCharacters(reversedText, N, D))