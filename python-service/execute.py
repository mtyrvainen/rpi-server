#!/usr/bin/python3
from gpiozero import LED
from signal import pause
from time import sleep
from websocket import create_connection

is_red_on = False
is_green_on = False
is_blue_on = False
red = LED(23)
green = LED(18)
blue = LED(24)

def blink_all():
  red.blink(0.2, 0.2, 3)
  blue.blink(0.2, 0.2, 3)
  green.blink(0.2, 0.2, 3)

def turn_all_off():
  red.off()
  green.off()
  blue.off()

def turn_all_on():
  red.on()
  green.on()
  blue.on()

def resume_previous_state():
  if is_red_on:
    red.on()
  else:
    red.off()

  if is_green_on:
    green.on()
  else:
    green.off()

  if is_blue_on:
    blue.on()
  else:
    blue.off()


def execute_queue_item(queue_item):
  print('executing queue item')
  print(queue_item["colors"])
  
  turn_all_off()
  blink_all()

  sleep(3)

  i = 0
  while i < len(queue_item["colors"]):
    if queue_item["colors"][i] == 'r':
      red.on()
      sleep(queue_item["times"][i])
      red.off()
    if queue_item["colors"][i] == 'g':
      green.on()
      sleep(queue_item["times"][i])
      green.off()
    if queue_item["colors"][i] == 'b':
      blue.on()
      sleep(queue_item["times"][i])
      blue.off()
    i += 1
    sleep(0.1)
  
  sleep(1)
  blink_all()
  sleep(1)
  resume_previous_state()

def execute_single_click(click_data):
  global is_red_on
  global is_green_on
  global is_blue_on
  
  print('executing single click: %s' % click_data["color"])
  if click_data["color"] == 'r':
    if is_red_on:
      red.off()
    else:
      red.on()
    is_red_on = not is_red_on
  if click_data["color"] == 'g':
    if is_green_on:
      green.off()
    else:
      green.on()
    is_green_on = not is_green_on
  if click_data["color"] == 'b':
    if is_blue_on:
      blue.off()
    else:
      blue.on()
    is_blue_on = not is_blue_on