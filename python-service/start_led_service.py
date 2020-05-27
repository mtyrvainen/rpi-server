#!/usr/bin/python3
import json
import websocket
import threading
import _thread
from time import sleep
from utils import is_json, parse_initial_values, parse_queue_item, parse_single_click
from execute import execute_queue_item, execute_single_click

is_initialized = False
is_execution_running = False
is_server_ready = False
max_leds_per_queue = -1
max_time_per_led = -1
min_time_per_led = -1 
time_between_executions = -1

def wait_and_request_next_item():
  global is_server_ready

  print('waiting between executions')
  sleep(time_between_executions)
  print('ready to execute again')
  is_server_ready = True
  ws.send("{ \"type\": \"requestNextInQueue\" }")

def on_message(ws, message):
  global is_initialized
  global max_leds_per_queue
  global max_time_per_led
  global min_time_per_led 
  global time_between_executions
  global is_execution_running
  global is_server_ready

  json_msg = is_json(message)

  if not json_msg:
    print('error: not valid json, discarding')
    return

  if ("type" not in json_msg):
    print('error: not valid message, type missing')
    return
    
  if json_msg["type"] == "serverInitialValues":
    if (parse_initial_values(json_msg)):
      print('ERROR: erroneous initial values, closing connection')
      ws.close()
      exit()

    if (is_initialized):
      print('initial values already defined, discarding')

    max_leds_per_queue = json_msg["maxLedsPerQueue"]
    max_time_per_led = json_msg["maxTimePerLed"] / 1000 # time in seconds
    min_time_per_led =  json_msg["minTimePerLed"] / 1000 # time in seconds
    time_between_executions = json_msg["timeBetweenExecutions"] / 1000 # time in seconds
    is_initialized = True
    is_server_ready = True
    print('server initialized successfully %g %g %g %g' % (max_leds_per_queue, max_time_per_led, min_time_per_led, time_between_executions))
    print('sending: requestNextInQueue')
    ws.send("{ \"type\": \"requestNextInQueue\" }")
    return

  if json_msg["type"] == "nextQueueItem":
    if not is_initialized or is_execution_running or not is_server_ready:
      print('error: server not ready, discarding queue item')
      return

    queue_item = parse_queue_item(json_msg)

    if not queue_item:
      print('error: not valid queue item, discarding')
      return

    #SEND STARTING EXECUTION
    is_execution_running = True
    is_server_ready = False
    print('sending: executionStarted')
    ws.send("{ \"type\": \"executionStarted\" }")

    #EXECUTE QUEUE ITEM
    execute_queue_item(queue_item)

    #SEND STOPPING EXECUTION
    is_execution_running = False
    print('sending: executionStopped')
    ws.send("{ \"type\": \"executionStopped\" }")
    
    _thread.start_new_thread(wait_and_request_next_item, ())
    return

  if json_msg["type"] == "singleClickData":
    if not is_initialized or is_execution_running:
      print('error: server not ready, single click')
      return
    
    single_click = parse_single_click(json_msg)

    if not single_click:
      print('error: not valid single click, discarding')
      return

    print('received single click')
    execute_single_click(single_click)
    return

  print('server not initialized or msg of unknown type: %s' % json_msg["type"])


def on_close(ws):
  print("### closed ###")

if __name__ == "__main__":
  websocket.enableTrace(False)
  ws = websocket.WebSocketApp("ws://tyrvainen.hopto.org:3001/led-socket", on_message = on_message, on_close = on_close)
  wst = threading.Thread(target=ws.run_forever)
  wst.daemon = True
  wst.start()

  conn_timeout = 5
  while not ws.sock.connected and conn_timeout:
    sleep(1)
    conn_timeout -= 1

  msg_counter = 0
  while ws.sock.connected:
    print(msg_counter)
    sleep(60)
    msg_counter += 1