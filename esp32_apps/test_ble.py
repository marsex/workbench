import ubluetooth as bluetooth
import struct

# Configuration
ble = bluetooth.BLE()
ble.active(True)

# Event Handling
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
        print('RX:', ble_rx)
        
ble.irq(ble_irq)

# GATT Server
UART_UUID = bluetooth.UUID('6E400001-B5A3-F393-E0A9-E50E24DCCA9E')
UART_TX = (bluetooth.UUID('6E400003-B5A3-F393-E0A9-E50E24DCCA9E'), bluetooth.FLAG_READ | bluetooth.FLAG_NOTIFY,)
UART_RX = (bluetooth.UUID('6E400002-B5A3-F393-E0A9-E50E24DCCA9E'), bluetooth.FLAG_WRITE,)
UART_SERVICE = (UART_UUID, (UART_TX, UART_RX,),)
SERVICES = (UART_SERVICE,)
((tx, rx,), ) = ble.gatts_register_services(SERVICES)

def stop_ble():
    print('stop ble')
    ble.gap_advertise(0)

def start_ble():
    print('start ble')
    ble.gap_advertise(100, to_byte('ESP32_ENV'))

def ble_wr(data):
    ble_tx = to_byte(data)
    ble.gatts_write(tx,ble_tx)

def to_byte(string):
    string = bytes(string, 'ascii')
    return bytearray((len(string) + 1, 0x09)) + string

