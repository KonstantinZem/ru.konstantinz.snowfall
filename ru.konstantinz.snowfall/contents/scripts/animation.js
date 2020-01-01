var component;
var config; //Здесь будут хранится настройки из конфигурационного файла
var cursorX = 0;//Переменная вынесена сюда, чтобы дальше не менятся, ведь при следующем обращении к ней курсор может быть в другом месте, что внесет неразбериху
var cursorY = 0;//Переменная вынесена сюда, чтобы дальше не менятся
var leftBorder = 40;
var rightBorder = 640;
var topBorder = 480;
var bottomBorder = 0;
var snowflakes = new Array();
var snwNumber = 10;
var windSpeed = 0;
var windSteps = 0;
var windMaxStepsNumber = 0;
var stepsMediana = 0;
var windDirection = 0;

var Ypos=new Array();//В этих массивах хранится координата каждой снежинки
var Xpos=new Array();
var Speed=new Array();
var Step=new Array();
var Cstep=new Array();


function initialize(){

  config = readConfigurationFile(); //Читаем настройки из файла конфигурации
  cursorX = config.xCursorPos;//По положению курсора узнаем куда пользователь поместил плазмоид так как в момент инициализации плазмоида курсор все еще будет над ним
  cursorY = config.yCursorPos;
  rightBorder = config.screenWidth - cursorX;
  leftBorder = cursorX - rightBorder;
  bottomBorder = config.screenHeight - cursorY;
  topBorder = - cursorY;
  snwNumber = config.snowflakesNumber;
  createSnoflakes();
  
  for (var i=0; i < snwNumber; i++){
		Ypos[i] = randomPosition('y');
		Xpos[i] = randomPosition('x');
		Speed[i]= Math.random()*(config.maxSpeed - config.minSpeed) + config.minSpeed;
		Cstep[i]=0;
		Step[i]=Math.random()*0.1+0.2;
		}
		console.log('Number of sowflakes = ' + i);
		
}

function readConfigurationFile(){
   var configEntry = {};
   configEntry.screenWidth = plasmoid.configuration.availableWidth;
   configEntry.screenHeight = plasmoid.configuration.availableHeight;
   configEntry.shellRotationLevel = plasmoid.configuration.shellRotationLevel;
   configEntry.xCursorPos = plasmoid.configuration.xCursorPos;
   configEntry.yCursorPos = plasmoid.configuration.yCursorPos;
   configEntry.snowflakesNumber = plasmoid.configuration.snowflakes;
   configEntry.folderName = plasmoid.configuration.snVariant;
   configEntry.maxSpeed = plasmoid.configuration.maxSpeed;
   configEntry.minSpeed = plasmoid.configuration.minSpeed;
   configEntry.prevChangeSign = plasmoid.configuration.changeSign;
   return configEntry;
}

function createSnoflakes() {
        
        for (var i=0; i < snwNumber; i++) {
			var component = Qt.createComponent("../ui/snowflake.qml");
            snowflakes[i] = component.createObject(appWindow);
			}
  
		for(var i = 0; i < snowflakes.length; i++){
			snowflakes[i].y = randomPosition('y');
			snowflakes[i].x = randomPosition('x');
			snowflakes[i].source = '../images/' + config.folderName + '/snowflake_' + snowflakes[i].imgVar + '.svg';
			}
		}

function randomPosition(position){
	let rndPos = 0;
	let rndNum = 10;
	
	switch(position){
		case 'x':
			rndPos = Math.random()*(rightBorder - leftBorder) + leftBorder;
		break;
		case 'y':
			rndPos = Math.random()*(bottomBorder - topBorder) + topBorder;
		break;
		case 'r'://Если просто надо сгенерировать небольшую случайную флуктуацию
			Math.random()*rndNum;
		break;
		default:
			rndPos = 0;
			console.log('ERROR: Random position Wrong argument');
		break;
		
	}
	
	return Math.round(rndPos);
}

function animate(){
let sy;
let sx;
   for (var i=0; i < snwNumber; i++){
		sy = Speed[i]*Math.sin(90*Math.PI/180);
		sx = Speed[i]*Math.cos(Cstep[i]);
		Ypos[i]+=sy;
		Xpos[i]+=sx;
		
		if (Ypos[i] > bottomBorder){//Если снежинка залетела за нижний край экрана
			Ypos[i] = topBorder + randomPosition('r');//Перекидываем ее наверх, внося небольшей элемент случайности
			Xpos[i] = randomPosition('x');
			Speed[i] = 1;
			}
			
			snowflakes[i].x = Xpos[i];
			snowflakes[i].y = Ypos[i];
			
			Cstep[i] += Step[i];
		}
		checkConfigChanges();//После каждого хода проверяем, не произошли ли изменения в конфигурационном файле
}

function choseWindDirection(){
	
	if(windSteps == 0){
		windDirection = Math.round(Math.random()*2);
		windMaxStepsNumber = Math.round(Math.random()*92 + 8);
		stepsMediana = Math.round(windMaxStepsNumber/2);
		console.log('Wind time = ' + windMaxStepsNumber);
		windTimer.running = false;
		windBlowingTimer.running = true;
		}
		if(windDirection > 1){
				windToRight();
				}else{
					windToLeft();
					}
}

function windToRight(){
	if(windSteps == 0){
		windTimer.running = false;
		windBlowingTimer.running = true;
		}
	
	for (var i=0; i < snwNumber; i++){
		Xpos[i]+= windSpeed;
		
		if(Xpos[i] > rightBorder){
			Xpos[i] = leftBorder + randomPosition('r');
			Ypos[i] = randomPosition('y');
			}
		}
	
	windSteps++;
	
	if(windSteps > stepsMediana){
		windSpeed --;
		}else{
			windSpeed ++;
			}
	
	if(windSpeed < 0){
		windSteps = 0;
		windBlowingTimer.running = false;
		windTimer.interval = Math.round(Math.random()*37000 + 3000);
		
		console.log('Wind blowing to right. New wind begins after ' + windTimer.interval/1000  + ' сек.');
		
		windTimer.running = true;
		}
}

function windToLeft(){
	
	for (var i=0; i < snwNumber; i++){
		Xpos[i]+= windSpeed;
		
		if(Xpos[i] < leftBorder){
			Xpos[i] = rightBorder - randomPosition('r');
			Ypos[i] = randomPosition('y');
			}
		}
	
	windSteps++;
	
	if(windSteps > stepsMediana){
		windSpeed ++;
		}else{
			windSpeed --;
			}
	
	if(windSpeed > 0){
		windSteps = 0;
		windBlowingTimer.running = false;
		windTimer.interval = Math.round(Math.random()*(40000 - 3000) + 3000);
		
		console.log('Wind blowing to left. New wind begins after ' + windTimer.interval/1000  + ' сек.');
		
		windTimer.running = true;
		}
}

function checkConfigChanges(){
	if(config.prevChangeSign != plasmoid.configuration.changeSign){
		removeSnowflakes();
		initialize();
		}
	}

function removeSnowflakes(){
	for(var i = 0; i < snowflakes.length; i++){
		appWindow.children[i].source = "";
		appWindow.children[i].destroy();
		}
	snowflakes = new Array();
}
