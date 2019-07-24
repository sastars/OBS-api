'use strict';

const OBSWebSocket = require('obs-websocket-js');

exports.getobs = function(body, res) {
  console.log(body.request);
  switch(body.request){
    case 'getSourceSettings':
      getSourceSettings(body,res);
      break;
    case 'getSceneItemProperties':
      getSceneItemProperties(body,res);
      break;
    case 'getBrowserSourceProperties':
      getBrowserSourceProperties(body,res);
      break;
    case 'getStreamSettings':
      getStreamSettings(body,res);
      break;
    default:
      res.json({message:'your get request is not recognised'});
  }
}

function getSourceSettings(body,res){
  var fields=['sourceName'];
  checkFields(body,res,fields,getSourceSettingsObs);
}
function getSceneItemProperties(body,res){
  var fields=['sourceName'];
  checkFields(body,res,fields,getSceneItemPropertiesObs);
}
function getBrowserSourceProperties(body,res){
  var fields=['sourceName'];
  checkFields(body,res,fields,getBrowserSourcePropertiesObs);
}
function getStreamSettings(body,res){
  var fields=[];
  checkFields(body,res,fields,getStreamSettingsObs);
}

exports.setobs = function(body, res) {
  console.log(body.request);
  switch(body.request){
    case 'addMediaSource':
      addMediaSource(body,res);
      break;
    case "changeMediaFile":
      changeMediaFile(body,res);
      break;
    case "addLinuxBrowserSource":
      addLinuxBrowserSource(body,res);
      break;
    case "changeLinuxBrowserAddress":
      changeLinuxBrowserAddress(body,res);
      break;
    case "addNewScene":
      addNewScene(body,res);
      break;
    case "setCurrentScene":
      setCurrentScene(body,res);
      break;
    case "deleteSceneItem":
      deleteSceneItem(body,res);
      break;
    case "setStreamSettings":
      setStreamSettings(body,res);
      break;
    case "startStreaming":
      startStreaming(body,res);
      break;
    case "stopStreaming":
      stopStreaming(body,res);
      break;
    default:
      res.json({message:'your set request is not recognised'});
  }
}

function addMediaSource(body,res){
  var fields=['sceneName','sourceName','fileAddress'];
  checkFields(body,res,fields,addMediaSourceObs);
}

function changeMediaFile(body,res){
  var fields=['sourceName','fileAddress'];
  checkFields(body,res,fields,changeMediaFileObs);
}

function addLinuxBrowserSource(body,res){
  var fields=['sceneName','sourceName','fileAddress'];
  checkFields(body,res,fields,addLinuxBrowserSourceObs);
}

function changeLinuxBrowserAddress(body,res){
  var fields=['sourceName','fileAddress'];
  checkFields(body,res,fields,changeLinuxBrowserAddressObs);
}

function addNewScene(body,res){
  var fields=['sceneName'];
  checkFields(body,res,fields,addNewSceneObs);
}

function setCurrentScene(body,res){
  var fields=['sceneName'];
  checkFields(body,res,fields,setCurrentSceneObs);
}

function deleteSceneItem(body,res){
  var fields=['sourceName'];
  checkFields(body,res,fields,deleteSceneItemObs);
}

function setStreamSettings(body,res){
  var fields=['streamAddress','streamkey'];
  checkFields(body,res,fields,setStreamSettingsObs);
}

function startStreaming(body,res){
  var fields=[];
  checkFields(body,res,fields,startStreamingObs);
}

function stopStreaming(body,res){
  var fields=[];
  checkFields(body,res,fields,stopStreamingObs);
}

//******* OBS interaction functions

function startStreamingObs(body,res,obs){
  obs.send('StartStreaming',{stream:{type:'rtmp_custom','settings':{'server':body.streamAddress,'key':body.streamkey}}})
  .then(data => {
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err => {
      res.json({err:err});
  });
}
function stopStreamingObs(body,res,obs){
  obs.send('StopStreaming')
  .then(data => {
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err => {
      res.json({err:err});
  });
}
function setStreamSettingsObs(body,res,obs){
  obs.send('SetStreamSettings',{type:'rtmp_custom','settings':{'server':body.streamAddress,'key':body.streamkey}})
  .then(data => {
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err => {
      res.json({err:err});
  });
}
function deleteSceneItemObs(body,res,obs){
  obs.send('DeleteSceneItem',{'item':{name:body.sourceName}})
  .then(data => {
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err => {
      res.json({err:err});
  });
}
function setCurrentSceneObs(body,res,obs){
  obs.send('SetCurrentScene',{'scene-name':body.sceneName})
  .then(data => {
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err => {
      res.json({err:err});
  });
}

function addNewSceneObs(body,res,obs){
  obs.send('AddNewScene',{'sourceName':'','sceneName':body.sceneName,typeIDName: '','sourceSettings':{}})
  .then(data => {
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err => {
      res.json({err:err});
  });
}

function addLinuxBrowserSourceObs(body,res,obs){
  //add in check for duplicate
  default_obs_source_props_browser.sourceName=body.sourceName;
  default_obs_source_props_browser.sourceSettings.url=body.fileAddress;
  default_obs_source_props_browser.sourceSettings.source=body.sourceName;
  obs.send('AddNewSource',default_obs_source_props_browser)
    .then(data=>{
      console.log('addLinuxBrowserSource',data);
      addtoSceneObs(body,res,obs);
    })

    .catch(err=>{
      console.log(default_obs_source_props_browser);
      res.json({err:err,message:'addBrowserSourceObs err'});
    })
}

function changeLinuxBrowserAddressObs(body,res,obs){
  obs.send('SetSourceSettings',{sourceName:body.sourceName,sourceSettings:{url:body.fileAddress}})
    .then(data=>{
      console.log('changeLinuxBrowserAddressObs',data);
      res.json(data);
      obs.disconnect();
    })

    .catch(err=>{
      res.json({err:err});
    })
}
function changeMediaFileObs(body,res,obs){
  obs.send('SetSourceSettings',{sourceName:body.sourceName,sourceType:"ffmpeg_source",sourceSettings:{input:body.fileAddress}})
    .then(data=>{
      console.log('changeMediaFileObs',data);
      res.json(data);
      obs.disconnect();
    })

    .catch(err=>{
      res.json({err:err});
    })
}

function addMediaSourceObs(body,res,obs){
  //add in check for duplicate
  default_obs_source_props_media.sourceName=body.sourceName;
  default_obs_source_props_media.sourceSettings.input=body.fileAddress;
  obs.send('AddNewSource',default_obs_source_props_media)
    .then(data=>{
      console.log('addMediaSourceObs',data);
      addtoSceneObs(body,res,obs)
    })

    .catch(err=>{
      res.json({err:err});
    })
}

function addtoSceneObs(body,res,obs){
  obs.send('AddtoScene',{'sourceName':body.sourceName,'sceneName':body.sceneName})
    .then(()=>{
      console.log('addtoSceneObs');
      setSceneItemPropertiesDefaultObs(body,res,obs);
    })
    .catch(err=>{
      setSceneItemPropertiesDefaultObs(body,res,obs);
    })
}

function setSceneItemPropertiesDefaultObs(body,res,obs){
  default_obs_item_props.item=body.sourceName;
  default_obs_item_props['scene-name']=body.sceneName
  obs.send('SetSceneItemProperties',default_obs_item_props)
    .then(data=>{
      console.log('setSceneItemPropertiesDefaultObs',data);
      getSceneItemPropertiesObs(body,res,obs);
    })
    .catch(err=>{
      res.json({err:err,message:'setSceneItemPropertiesDefaultObs err'});
    })
}


// Get functions
function getSourceListObs(body,res,obs){
  obs.send('GetSourcesList').then(data=>{
    console.log(data);
    res.json(data);
    obs.disconnect();
  })
  .catch(err=>{
    res.json({err:err});
  })
}
function getSourceSettingsObs(body,res,obs){
  obs.send('GetSourceSettings',{'sourceName':body.sourceName})
    .then(data=>{
      console.log(data);
      res.json(data);
      obs.disconnect();
    })
    .catch(err=>{
      res.json({err:err});
    })
}
function getSceneItemPropertiesObs(body,res,obs){
  obs.send('GetSceneItemProperties',{'item':body.sourceName})
    .then(data=>{
      console.log(data);
      res.json(data);
      obs.disconnect()
    })
    .catch(err=>{
      res.json({err:err,message:'getSceneItemPropertiesObs err'});
    })
}
function getBrowserSourcePropertiesObs(body,res,obs){
  obs.send('GetBrowserSourceProperties',{'source':body.sourceName})
    .then(data=>{
      console.log(data);
      res.json(data);
      obs.disconnect()
    })
    .catch(err=>{
      res.json({err:err,message:'getBrowserSourcePropertiesObs err'});
    })
}

function getStreamSettingsObs(body,res,obs){
  obs.send('GetStreamSettings')
    .then(data=>{
      console.log(data);
      res.json(data);
      obs.disconnect();
    })
    .catch(err=>{
      res.json({err:err,message:'getSceneItemPropertiesObs err'});
    })
}

function checkFields(body,res,fields,callback){
  //implement checking the body has the required fields
  openWebSocObsSet(body,res,callback);
}

function openWebSocObsSet(body,res,callback){
  var obsInstance = new OBSWebSocket();
  obsInstance.connect(body)
    .then(()=>{
      console.log('connected');
      callback(body,res,obsInstance);
    })
    .catch(err => {
        console.log(err);
        res.json({message:'OBS connection err',err:err});
    });
  obsInstance.on('error', err => {
    res.json({message:'OBS connection err',err:err});
  });
}


var default_obs_item_props={
  "item":"",
  "scene-name":"",
  "bounds":{"alignment":0,"type":"OBS_BOUNDS_SCALE_INNER","x":1920,"y":1080},
  "crop":{"bottom":0,"left":0,"right":0,"top":0},
  "locked":false,
  "position":{"alignment":5,"x":0,"y":0},
  "rotation":0,
  "scale":{"x":2,"y":2},
  "status":"ok",
  "visible":true
}
var default_obs_source_props_media={
  "sourceName":"tom",
  "sourceSettings":{
    "input": "",
    "is_local_file": false,
    "local_file": ""},
  "typeIDName":"ffmpeg_source"
}

var default_obs_set_browser={
    "source": "",
    "status": "ok",
    "width": 1920,
    "height": 1080,
    "is_local_file": false,
    "url": ""
}

var default_obs_source_props_browser={
    "source": "",
    "sourceSettings": {
        "height": 1080,
        "is_local_file": false,
        "source": "",
        "url": "",
        "width": 1920
    },
    "sourceType": "linuxbrowser-source",
    "typeIDName":"linuxbrowser-source",
    "status": "ok"
}
/*
var default_obs_source_props_browser={
    "sourceName": "lb2",
    "sourceSettings": {},
    "sourceType": "linuxbrowser-source",
    "typeIDName":"linuxbrowser-source",
    "status": "ok"
}
*/
