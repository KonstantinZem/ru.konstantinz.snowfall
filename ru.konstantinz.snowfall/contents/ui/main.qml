/*
    Copyright 2016 Konstantin Zemoglyadchuk

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of
    the License or (at your option) version 3 or any later version
    accepted by the membership of KDE e.V. (or its successor approved
    by the membership of KDE e.V.), which shall act as a proxy
    defined in Section 14 of version 3 of the license.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import QtQuick 2.0
import QtQuick.Window 2.1
import org.kde.plasma.components 2.0 as PlasmaComponents
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.core 2.0 as PlasmaCore
import "../scripts/animation.js" as SnowAnimation


Item{
    id:root
    
    Plasmoid.title: "Snowfall";
    Plasmoid.backgroundHints: "NoBackground";

     
    Image{
        id:icon;
        visible:true
        source: "../images/snow1/snowflake_1.svg";
        rotation:0;
        x:0;
        y:0;
        width:50;
        height:50;
        MouseArea {
            anchors.fill: parent
            onClicked: {
                SnowAnimation.removeSnowflakes();
                SnowAnimation.initialize();
            }
        }
    }

 Item{
        id:appWindow;
        width:50;
        height:50;
        
        Component.onCompleted: {
      }
    }
  
    
    Timer {
    id: fallTimer;
    interval: 200;
    repeat: true;
    running: true;
        onTriggered:{
            SnowAnimation.animate();
        }
    }
    
    Timer {
    id: windTimer;
    interval: 8000;
    repeat: true;
    running: true;
        onTriggered:{
            console.log('Wind begins')
            SnowAnimation.choseWindDirection();
        }
    }
    
    Timer {
    id: windBlowingTimer;
    interval: 100;
    repeat: true;
    running: false;
        onTriggered:{
            SnowAnimation.choseWindDirection();
        }
    }


    PlasmaCore.DataSource {
        id: cursorPositionSource;
        engine: "mouse";
        connectedSources: ["Position"];
        
    }
    
    PlasmaCore.DataSource {
        id: executeSource
        property string xrnd: "no"
        property int availableWidth: 0
        engine: "executable"
        connectedSources: ["xrandr -q | grep '\*'"]
        
            onNewData: {
           
                var trimmedStdout = data.stdout.trim();
                xrnd = trimmedStdout;
                var sta = executeSource.xrnd;
                var stb= sta.replace("x"," ");
                var myScreenResolution = stb.split(' ');
                plasmoid.configuration.availableWidth = myScreenResolution[0];
                plasmoid.configuration.availableHeight = myScreenResolution[1];
             
          }
        
    }

    Component.onCompleted: {
        
       if(plasmoid.configuration.first_start > 0){//Если плазмоид запускается впервые (в конфиге стоит значение 1)
            
           //Узнаем из dataEngane позицию курсора который в этот момент должен находится над плазмоидом
            var cursorPos = cursorPositionSource.data["Position"]["Position"]; 
            plasmoid.configuration.xCursorPos = cursorPos.x;
            plasmoid.configuration.yCursorPos = cursorPos.y;
            plasmoid.configuration.first_start = 0;
            
       }
       
       print("cursor = " + plasmoid.configuration.xCursorPos + "; " + plasmoid.configuration.yCursorPos);
       SnowAnimation.initialize();
    }
    
}
