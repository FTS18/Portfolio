import pyautogui
import time
import random

def type_code_naturally(filename):
    with open(filename, 'r') as file:
        code_lines = file.readlines()

    # Adjust these values based on your needs
    base_delay_between_keys = 0.03
    delay_variation = 0.03
    delay_between_lines = 0.35
    random_pause_interval = 10  # Introduce a pause after a random number of lines

    # Give some time to switch to the code editor
    time.sleep(4)

    for idx, line in enumerate(code_lines, start=1):
        pyautogui.typewrite(line.strip(), interval=base_delay_between_keys + random.uniform(-delay_variation, delay_variation))
        pyautogui.press('enter')

        # Introduce a pause after a random number of lines
        if idx % random_pause_interval == 0:
            time.sleep(random.uniform(1, 3))

        time.sleep(delay_between_lines)

if __name__ == "__main__":
    file_to_type = ''
    type_code_naturally(file_to_type)
