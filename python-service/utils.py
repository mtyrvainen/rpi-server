#!/usr/bin/python3
import json

# Check if string is valid JSON
def is_json(msg_string):
  try:
    json_object = json.loads(msg_string)
  except ValueError as e:
    print(e)
    return False
  return json_object

def parse_initial_values(json_values):
  if ("maxLedsPerQueue" not in json_values
    or "maxTimePerLed" not in json_values
    or "minTimePerLed" not in json_values
    or "timeBetweenExecutions" not in json_values):
    print('error: missing initial server parameters')
    return False
    
  if (not isinstance(json_values["maxLedsPerQueue"], int)
    or not isinstance(json_values["maxTimePerLed"], (int, float))
    or not isinstance(json_values["minTimePerLed"], (int, float))
    or not isinstance(json_values["timeBetweenExecutions"], (int, float))):
    print('wrong types of initial values')
    return False

  if (json_values["maxLedsPerQueue"] < 0
    or json_values["maxTimePerLed"] < 0
    or json_values["minTimePerLed"] < 0
    or json_values["timeBetweenExecutions"] < 0):
    print('unreasonable initial values')
    return False

def parse_single_click(json_item):
  if ("singleClickData" not in json_item):
    print('missing single click data')
    return False
  
  clickData = json_item["singleClickData"]

  if ("type" not in clickData
    or "color" not in clickData):
    print('error: missing single click data')
    return False
  
  if (not clickData["type"] == "ledSingleClick"):
    print('error: wrong single click data type')
    return False

  if (clickData["color"] != 'r' and clickData["color"] != 'g' and clickData["color"] != 'b'):
    print('error: undefined color values')
    return False
  
  return clickData
  

def parse_queue_item(json_item):
  if ("queueItem" not in json_item):
    print('missing item data')
    return False

  item = json_item["queueItem"]

  if ("type" not in item
    or "colors" not in item
    or "times" not in item):
    print('error: missing queue item values')
    return False
    
  if (not item["type"] == "ledQueue"):
    print('error: wrong queue item type')
    return False

  if (not isinstance(item["colors"], list)
    or not isinstance(item["times"], list)):
    print('error: wrong queue item value types')
    return False
    
  if (len(item["colors"]) != len(item["times"])):
    print('error: queue item data inconsistent')
    return False

  for color in item["colors"]:
    if (color != 'r' and color != 'g' and color != 'b'):
      print('error: undefined color values')
      return False

  for time in item["times"]:
    if (not isinstance(time, (int, float))):
      print('error: erroneous time values')

  return item