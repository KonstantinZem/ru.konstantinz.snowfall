import QtQuick 2.2
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

Item {
    
    id: 'general'
    
    property alias cfg_snowflakes: snowflakesNumb.value;
    property string cfg_snVariant: '1';
    property int cfg_changeSign: 0

    GridLayout {
       // Layout.fillWidth: true;
        columns: 2;
        rows: 4;
        Image{
            Layout.column:2
            Layout.row: 1
            id:body;
            source: "../../images/icon.svg";
            rotation:0;
            height:20;
            width:20;
            }
      
        Text {
            Layout.row: 1
            Layout.column:1
            text: i18n('<p><b><a href=\"http://konstantinz.byethost32.com/snail_desktop.htm\">snowflake 1.0</a></b></p><p>Snowfal on you desktop</p><p><a href=\"mailto:konstantinz@bk.ru\">Konstantin Zemogleadchuk</a></p>');
            Layout.alignment: Qt.AlignLeft;
            onLinkActivated: Qt.openUrlExternally(link)
             anchors.left: parent.left
            }
        GroupBox {
            
        GroupBox {
            title: i18n("Options")
            flat: true

            ExclusiveGroup {
                id: nameEg;
                }

            ColumnLayout {
                Label {
                    Layout.row: 2;
                    Layout.column:1;
                    text: i18n('<b>Snow variants:</b>');
                    }
            RadioButton {
                id: showFullNameRadio
                Layout.fillWidth: true
                exclusiveGroup: nameEg
                text: i18n("Variant 1")
                checked:true
                onClicked: {
                    cfg_snVariant = 'snow1';
                    cfg_changeSign = Math.floor(Math.random() * 10000);
                    }
                }

            RadioButton {
                Layout.fillWidth: true
                exclusiveGroup: nameEg
                text: i18n("Variant 2")
                onClicked: {
                    cfg_snVariant = 'snow2';
                    cfg_changeSign = Math.floor(Math.random() * 10000);
                    }
                }
        
            Label {
                Layout.row: 2;
                Layout.column:1;
                text: i18n('<b>Snowflakes number:</b>');
                }
        
            Slider {
                Layout.row: 3;
                Layout.column:1;
                id: snowflakesNumb;
                maximumValue: 150.0;
                stepSize: 10.0;    
                onValueChanged: {
                    cfg_changeSign = Math.floor(Math.random() * 10000);
                    }
                }
              
            }
        }
    
      }

    }
    
}
