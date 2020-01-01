//Snowflake images downloaded from https://www.svgrepo.com/
import QtQuick 2.0

Image{  
        property int imgVar;
        
        id:img;
        visible:true;
        source: "";
        rotation:0;
        x:0;
        y:0;
        width:20;
        height:20;
        Component.onCompleted: {
            var snVar = Math.round(Math.random()*2);
            var snDim = Math.random()*20 + 10;
            this.imgVar = snVar
            this.height = snDim;
            this.width = snDim;
            
        }
}
