const INPUT_PINS = document.getElementById('INPUT_PINS')
const OUTPUT_PINS = document.getElementById('OUTPUT_PINS')
const show_dht1 = document.getElementById('show_dht1')
const show_dht2 = document.getElementById('show_dht2')
const layer_dht1 = document.getElementById('layer_dht1')
const layer_dht2 = document.getElementById('layer_dht2')
const loading = document.getElementById('loading')
const inicio_layer = document.getElementById('main_layer')
const login_layer = document.getElementById('login_layer')
const login_input = document.getElementById('login_input')
const asmon_input = document.getElementById('asmon_user')
const menu_layer = document.getElementById('menu_layer')
const host_menu = document.getElementById('host_menu')
const host_menu_drop = document.getElementById('host_menu_drop')
const host1 = document.getElementById('host1')
const host2 = document.getElementById('host2')
const host3 = document.getElementById('host3')
const hostname = document.getElementById('hostname')
const controles_menu = document.getElementById('controles_menu')
const controles_menu_drop = document.getElementById('controles_menu_drop')
const menu_inicio = document.getElementById('menu-inicio')
const menu_sensores = document.getElementById('menu-sensores')
const menu_monitoreo = document.getElementById('menu-monitoreo')
const menu_opciones = document.getElementById('menu-opciones')
const menu_salir = document.getElementById('menu-salir')
const current_menu = document.getElementById('current_menu')
const arrow_div = document.getElementById('arrow_div')
const host_status = document.getElementById('host_status')
const sensores_overlay = document.getElementById('sensores_overlay')
const sensores_layer = document.getElementById('sensores_layer')
const sensores_menu = document.getElementById('sensores_menu')

const segmento_medicion_1 = document.getElementById('segmento_medicion-1')
const segmento_sensores_1 = document.getElementById('segmento_sensores-1')
const segmento_sensor_condicion_1 = document.getElementById('segmento_sensor_condicion-1')
const segmento_tmp_interval = document.getElementById('segmento_tmp_interval-1')
const segmento_estado_on_1 = document.getElementById('segmento_estado_on-1')
const segmento_salida_on_1 = document.getElementById('segmento_salida_on-1')
const segmento_on_time_1 = document.getElementById('segmento_on_time-1')
const segmento_estado_off_1 = document.getElementById('segmento_estado_off-1')
const segmento_salida_off_1 = document.getElementById('segmento_salida_off-1')
const segmento_off_time_1 = document.getElementById('segmento_off_time-1')
const segmento_drop_layer = document.getElementById('segmento_drop_layer')
const segmento_objeto = document.getElementsByClassName('segmento_objeto')

const label_tmp_set = document.getElementById('label_tmp_set')

const send_sensor1_data = document.getElementById('send_sensor1_data')

data = ''
command = ''
host = 'feelfree.softether.net'
user='admin'
psw='YWRtaW4='
first_login='true'
get_sensor_cfg=false
cam_url='http://delecar.softether.net:81/stream?'

asmon_input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    login_input.click();
  }
});

form_load()


function form_load(){
  hide_layer(loading)
  login_input.addEventListener('click', login)
  menu_layer.addEventListener('click', drop_menu)
  host_menu.addEventListener('click', drop_menu)


  host1.addEventListener('click', set_host1)
  host2.addEventListener('click', set_host2)
  host3.addEventListener('click', set_host3)
  
  segmento_tmp_interval.addEventListener('click', drop_segmento)
  segmento_salida_on_1.addEventListener('click', drop_segmento)
  segmento_on_time_1.addEventListener('click', drop_segmento)
  segmento_off_time_1.addEventListener('click', drop_segmento)
  segmento_drop_layer.addEventListener('click', drop_segmento)
  
  for (var i = 0; i < segmento_objeto.length; i++) {
    segmento_objeto[i].addEventListener("click", seleccionar_objeto);
  }

  send_sensor1_data.addEventListener('click', send_sensor_data)

  hide_layer(inicio_layer)
}
function set_sensor_data(json){
  if (json['dht1']['tmp_enable'] == 'true'){
    document.getElementById('tmp_enable-0').checked = true
  }else{document.getElementById('tmp_enable-0').checked = false}
  document.getElementById('var_set').value = json['dht1']['tmp_set']
  document.getElementById('segmento_salida_on-1').getElementsByClassName('objeto')[0].textContent = 'Salida ' + json['dht1']['tmp_salida']
  document.getElementById('on_time').value = json['dht1']['tmp_on_time']
  document.getElementById('off_time').value = json['dht1']['tmp_off_time']
  get_sensor_cfg=false
}

function send_sensor_data(){
  document.getElementById('tmp_enable-0').value = document.getElementById('tmp_enable-0').checked
  command='dht1'
  data=(
    'tmp_enable=' + get_value('tmp_enable-0') + ',' +
    'tmp_set=' + get_value('var_set') + ',' +
    'tmp_salida=' + get_value('segmento_salida_on-1') + ',' +
    'tmp_on_time=' + get_value('on_time') + ',' +
    'tmp_off_time=' + get_value('off_time') + ',' +
    'tmp_interval=' + get_value('tmp_interval')
  )
  console.log(data)
}

function get_value(element){
  send_value = document.getElementById(element).value
  if (element.search('segmento') != -1){
    get_segmento_value = document.getElementById(element)  
    get_segmento_value = (get_segmento_value.innerHTML).split('>')[1].replace('</div','')
    get_segmento_value = get_segmento_value.trim()
    get_segmento_value = get_segmento_value.replace(' ','')
    if (get_segmento_value.search('Salida') != -1 ){get_segmento_value=get_segmento_value.replace('Salida','')}
    document.getElementById(element).value = get_segmento_value
    send_value = document.getElementById(element).value
    console.log(send_value)
  }
  return send_value
}

function login(){
  show_layer(loading)
  asmon_user=asmon_input.value
  start()
}


function seleccionar_objeto(){
  this.innerHTML=(this.innerHTML).replace('"unselected"','"selected"')
  console.log(focus_segment.id)
  objecto_seleccionado = (this.innerHTML).split('>')[1].replace('</div','')
  console.log(objecto_seleccionado)
  focus_segment.getElementsByClassName('objeto')[0].textContent = objecto_seleccionado
}

function drop_segmento(){
  hide_drop();
  if (segmento_drop_layer.style.display=='block'){
    hide_layer(segmento_drop_layer)
  }else{
    show_layer(segmento_drop_layer)
  }
  
  if (this.id != 'segmento_drop_layer'){
    //console.log(this.id);
    focus_segment=this
    drop_id = (this.id).replace('segmento_','') + '-drop';
    drop_id = document.getElementById(drop_id)

    drop_id.style.left=getOffset(this).left + 'px';
    drop_id.style.top=getOffset(this).top + 'px';
    drop_id.style.width=getOffset(this).width + 'px';

    drop_id.style.display = 'block';
  }
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX ,
    top: rect.top + window.scrollY - 12,
    width: rect.width
  };
}

function hide_drop(){
  document.getElementById('tmp_interval-1-drop').style.display='none';
  document.getElementById('salida_on-1-drop').style.display='none';
  document.getElementById('on_time-1-drop').style.display='none';
  document.getElementById('off_time-1-drop').style.display='none';
}

function handle_menu_control(){
  console.log(this.id)
  img_id = this.id
  img_id = img_id.replace('-','_')
  
  menu_img = document.getElementById(img_id)
  if (img_id == 'menu_salir'){
    document.location.reload(true)
  }
  if (img_id == 'menu_sensores'){
    get_sensor_cfg=true
    hide_layer(inicio_layer)
    show_layer(sensores_layer2)
  }
  if (img_id == 'menu_inicio'){
    hide_layer(sensores_layer2)
    load_inicio()
  }
  
  current_menu.src = menu_img.src
  
  console.log(menu_img.src)
}


function set_host1(){
  host = 'feelfree.softether.net'
  hostname.textContent='Red AR#1'
  host1.style.color = 'white'
  host2.style.color = '#b9b9b9'
  host3.style.color = '#b9b9b9'
  start()
}
function set_host2(){
  host = '192.168.0.107'
  hostname.textContent='Localhost 1259'
  
  cam_url='http://192.168.0.106:81/stream?'
  host2.style.color = 'white'
  host1.style.color = '#b9b9b9'
  host3.style.color = '#b9b9b9'
  start()
}
function set_host3(){
  host = 'delecar2.softether.net'
  hostname.textContent='Red AR#2'
  host3.style.color = 'white'
  host2.style.color = '#b9b9b9'
  host1.style.color = '#b9b9b9'
  start()
}

function drop_menu(){
  if (menu_layer.style.display=='block'){
    hide_layer(menu_layer)
    hide_layer(host_menu_drop)
    hide_layer(controles_menu_drop)
  }else{
    show_layer(menu_layer)
    hide_layer(controles_menu_drop)
    show_layer(host_menu_drop)
  }
}
function drop_controles_menu(){
  if (menu_layer.style.display=='block'){
    hide_layer(menu_layer);
    hide_layer(host_menu_drop);
    hide_layer(controles_menu_drop);
  }else{
    show_layer(menu_layer);
    hide_layer(host_menu_drop);
    show_layer(controles_menu_drop);
  }
}


function show_sensors(){
  if (show_dht1.checked == true){show_layer(layer_dht1)}
  else{hide_layer(layer_dht1)}

  if (show_dht2.checked == true){show_layer(layer_dht2)}
  else{hide_layer(layer_dht2)}
}


function send_out(pin){send_output(document.getElementById(this.id))}

function send_output(out){
  show_layer(loading)
  pin=out.id
  pin=pin.slice(4,5)
  pin=Number(pin)
  swi='pin-'+pin
  pin=pin+1
  if (document.getElementById(swi).checked == true)
    {command='output_state',data=pin+'=0'}
  else
    {command='output_state',data=pin+'=1'}
}


function load_inicio(){

  show_dht1.addEventListener('click', show_sensors)
  show_dht2.addEventListener('click', show_sensors)
  login_input.addEventListener('click', login)

  controles_menu.addEventListener('click', drop_controles_menu)
  
  current_menu.style.cursor = 'pointer'
  arrow_div.style.cursor = 'pointer'
  show_layer(arrow_div)

  menu_inicio.addEventListener('click', handle_menu_control)
  menu_sensores.addEventListener('click', handle_menu_control)
  menu_monitoreo.addEventListener('click', handle_menu_control)
  menu_opciones.addEventListener('click', handle_menu_control)
  menu_salir.addEventListener('click', handle_menu_control)
  document.getElementById('downloadImg').src = (cam_url + Math.random().toString(10));
  setTimeout(function(){ //load again, just to be sure xd
    document.getElementById('downloadImg').src = (cam_url + Math.random().toString(10));
  }, 500);

  for (x=0;x<8;x++){
    pin='swi-'+x;
    document.getElementById(pin).addEventListener('click', send_out);
  }

  hide_layer(loading)
  hide_layer(login_layer)
  show_layer(inicio_layer)
}

function getd(){
  
  if (data == ''){app_json='{"version":"v0.9.1.1","platform":"chrome","user":"'+asmon_user+'","command":"get"}'}
  else{app_json='{"version":"v0.9.1.1","platform":"chrome","user":"'+asmon_user+'","command":"'+command+'","update":{"command":"'+command+'","update":"'+data+'"}}'}

  data = ''
	var host_protocol = 'http://'+host+':1259/'+app_json+'/'
	fetch(host_protocol).then(function(response) {return response.json();}).then(function(json)
	{
    host_status.src = 'img/online.png'

    if (first_login == 'true'){
      show_sensors()
      load_inicio()
      first_login = 'false'
    }

    for (x = 0; x < 8; x++){
      inp='in-'+x
      input_led = document.getElementById(inp)

      if (json['gpio']['input_state'][x] == 1){
        if (input_led.checked == false){hide_layer(loading)}
        input_led.checked = true
      }else{
        if (input_led.checked == true){hide_layer(loading)}
        input_led.checked = false
      }

      inp='pin-'+x
      output_switch = document.getElementById(inp)
      
      if (json['gpio']['output_state'][x] == 1){
        if (output_switch.checked == false){hide_layer(loading)}
        output_switch.checked = true
      }else{
        if (output_switch.checked == true){hide_layer(loading)}
        output_switch.checked = false
      }
    }
    
    dht1_tmp.textContent=json['dht1']['tmp']
    dht1_hmd.textContent=json['dht1']['hmd']
    if (dht1_hmd.textContent.length>=6){dht1_hmd.textContent=dht1_hmd.textContent.slice(0,5)
        if(dht1_hmd.textContent.substring(4,5) == '0'){dht1_hmd.textContent=dht1_hmd.textContent.slice(0,4)}}
    
    label_tmp_set.textContent=dht1_tmp.textContent+'°C'
    
    dht2_tmp.textContent=json['dht2']['tmp']
    dht2_hmd.textContent=json['dht2']['hmd']
    if (dht2_hmd.textContent.length>=6){dht2_hmd.textContent=dht2_hmd.textContent.slice(0,5)
        if(dht2_hmd.textContent.substring(4,5) == '0'){dht2_hmd.textContent=dht2_hmd.textContent.slice(0,4)}}
    
    if (get_sensor_cfg==true){set_sensor_data(json)};
		start()
	});
};


function start(){
  setTimeout(function(){
    getd();
    host_status.src = 'img/tx.png';
  }, 250);
}


function hide_layer(h_layer){h_layer.style.display='none';}
function show_layer(s_layer){s_layer.style.display='block';}
function flex_layer(s_layer){s_layer.style.display='flex';}


//<img id='downloadImg' STYLE='position:absolute; TOP:0px; LEFT:0px' width='100%' />
//<iframe id='iframefast' height='0' width='0'>
//<iframe id='iframe' src= '" & jpg_link & "?' onload='sendit()' height='0' width='0'>

//YWRtaW4=
//@update:"[0,0,0,0,0,0,0,0,0,0,0,0,0,0]"@end_data
