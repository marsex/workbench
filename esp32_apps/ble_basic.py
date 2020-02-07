import ubluetooth as bluetooth
from structure import com

def ble_irq(event, data):
  # print received data
  try:
    conn_handle, addr_type, addr = data
  except:
    conn_handle, addr_type = data

  print('\nevent:',event)

  if event == 1:
    print('USER:',addr,'connected')
  elif event == 2:
    print('USER:',addr,'disconnected')
    start_ble()
  elif event == 4:
    ble_rx = ble.gatts_read(rx)
    com.parse_data(ble_rx)
    print('RX:', ble_rx)

def stop():
  print('stop ble')
  ble.gap_advertise(0)
  ble.active(False)

def start():
  # Configuration
  ble = bluetooth.BLE()
  ble.active(True)
  ble.irq(ble_irq)
  
  # GATT Server
  UART_UUID = bluetooth.UUID('6E400001-B5A3-F393-E0A9-E50E24DCCA9E')
  UART_TX = (bluetooth.UUID('6E400003-B5A3-F393-E0A9-E50E24DCCA9E'), bluetooth.FLAG_READ | bluetooth.FLAG_NOTIFY,)
  UART_RX = (bluetooth.UUID('6E400002-B5A3-F393-E0A9-E50E24DCCA9E'), bluetooth.FLAG_WRITE,)
  UART_SERVICE = (UART_UUID, (UART_TX, UART_RX,),)
  SERVICES = (UART_SERVICE,)
  ((tx, rx,), ) = ble.gatts_register_services(SERVICES)

  # Start advertising
  ble.gap_advertise(1000, to_byte('ESP32_ENV'))

def ble_wr(data):
  ble_tx = to_byte(data)
  ble.gatts_write(tx,ble_tx)

def to_byte(string):
  string = bytes(string, 'ascii')
  return bytearray((len(string) + 1, 0x09)) + string