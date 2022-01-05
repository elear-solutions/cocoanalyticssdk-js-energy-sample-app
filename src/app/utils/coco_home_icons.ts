// import { Injectable } from '@angular/core';
// import { CMD_ON_OFF_ID, ATTR_ON_OFF_ID, ATTR_ON_OFF_NAME } from '../enums/coco_std_data_on_off_types';
// import { CMD_LEVEL_ID, ATTR_LEVEL_ID, ATTR_LEVEL_NAME } from '../enums/coco_std_data_level_types';
// import { CMD_COLOR_ID, ATTR_COLOR_ID, ATTR_COLOR_NAME } from '../enums/coco_std_data_color_types';
// import { CMD_LOCK_ID, ATTR_LOCK_ID, ATTR_LOCK_NAME } from '../enums/coco_std_data_lock_types';
// import { CMD_METER_ID, ATTR_METER_ID, ATTR_METER_NAME } from '../enums/coco_std_data_meter_types';
// import { CMD_MOTION_ID, ATTR_MOTION_ID, ATTR_MOTION_NAME } from '../enums/coco_std_data_motion_types';
// import { CMD_OCCUPANCY_ID, ATTR_OCCUPANCY_ID, ATTR_OCCUPANCY_NAME } from '../enums/coco_std_data_occupancy_types';
// import { CMD_CONTACT_SENSING_ID, ATTR_CONTACT_SENSING_ID, ATTR_CONTACT_SENSING_NAME } from '../enums/coco_std_data_contact_sensing_types';
// import { CMD_FLUID_LEVEL_ID, ATTR_FLUID_LEVEL_ID, ATTR_FLUID_LEVEL_NAME } from '../enums/coco_std_data_fluid_level_types';
// import { CMD_FIRE_SENSING_ID, ATTR_FIRE_SENSING_ID, ATTR_FIRE_SENSING_NAME } from '../enums/coco_std_data_fire_sensing_types';
// import { CMD_TEMPERATURE_ID, ATTR_TEMPERATURE_ID, ATTR_TEMPERATURE_NAME } from '../enums/coco_std_data_temperature_types';
// import { CMD_ILLUMINANCE_ID, ATTR_ILLUMINANCE_ID, ATTR_ILLUMINANCE_NAME } from '../enums/coco_std_data_illuminance_types';
// import { CMD_POWER_TYPES_ID, ATTR_POWER_TYPES_ID, ATTR_POWER_TYPES_NAME } from '../enums/coco_std_data_power_types';
// import { CMD_TUNNEL_ID, ATTR_TUNNEL_ID, ATTR_TUNNEL_NAME } from '../enums/coco_std_data_tunnel_types';
// import { CMD_HUMIDITY_ID, ATTR_HUMIDITY_ID, ATTR_HUMIDITY_NAME } from '../enums/coco_std_data_humidity_types';
// import { CMD_KEYPRESS_SENSING_ID, ATTR_KEYPRESS_SENSING_ID, ATTR_KEYPRESS_SENSING_NAME } from '../enums/coco_std_data_keypress_sensing_types';
// import { CMD_WARNING_ID, ATTR_WARNING_ID, ATTR_WARNING_NAME } from '../enums/coco_std_data_warning_dev_types';
// import { ATTR_NETWORK_CONFIG_ID, ATTR_NETWORK_CONFIG_NAME } from '../enums/coco_std_data_network_config_types';
// import { CMD_MEDIA_STREAM_ID, ATTR_MEDIA_STREAM_ID, ATTR_MEDIA_STREAM_NAME } from '../enums/coco_std_data_media_stream_types';
// import { CMD_STORAGE_ID, ATTR_STORAGE_ID, ATTR_STORAGE_NAME } from '../enums/coco_std_data_storage_config_types';
// import { CMD_STORAGE_CONTROL_ID, ATTR_STORAGE_CONTROL_ID, ATTR_STORAGE_CONTROL_NAME } from '../enums/coco_std_data_storage_control_types';
// import { CMD_MOTOR_TYPES_ID, ATTR_MOTOR_TYPES_ID, ATTR_MOTOR_TYPES_NAME } from '../enums/coco_std_data_motor_types';
// import { CMD_IMAGE_CTRL_ID, ATTR_IMAGE_CTRL_ID, ATTR_IMAGE_CTRL_NAME } from '../enums/coco_std_data_image_control_types';
// import { CMD_SNAPSHOT_ID, ATTR_SNAPSHOT_ID, ATTR_SNAPSHOT_NAME } from '../enums/coco_std_data_snapshot_types';

// const CAPABILITY_NAME = {
//   0: "ON OFF CONTROL", //done
//   1: "LEVEL CTRL", //done
//   2: "COLOR CTRL",//done
//   3: "LOCK CONTROL",//done
//   4: "ENERGY METERING",//done
//   5: "MOTION SENSING",//done
//   6: "OCCUPANCY SENSING",//done
//   7: "CONTACT SENSING",//done
//   8: "FLUID LEVEL MEASUREMENT",//done
//   9: "FIRE SENSING",//done
//   10: "TEMPERATURE MEASUREMENT",//done
//   11: "ILLUMINANCE MEASUREMENT",//done
//   12: "POWER LEVEL MEASUREMENT",
//   13: "TUNNEL CONTROL",
//   14: "REL HUMIDITY MEASUREMENT",
//   15: "KEYPRESS SENSING",
//   16: "WARNING DEV CONTROL",
//   17: "NETWORK CONFIGURATION",
//   18: "MEDIA STREAM",
//   19: "STORAGE CONFIG",
//   20: "STORAGE CONTROL",
//   21: "MOTOR CTRL",
//   22: "IMAGE CTRL",
//   23: "SNAPSHOT"
// }

// const CAPABILITY_ID = {
//   0: "COCO_STD_CAP_ON_OFF_CONTROL", //done
//   1: "COCO_STD_CAP_LEVEL_CTRL", //done
//   2: "COCO_STD_CAP_COLOR_CTRL",//done
//   3: "COCO_STD_CAP_LOCK_CONTROL",//done
//   4: "COCO_STD_CAP_ENERGY_METERING",//done
//   5: "COCO_STD_CAP_MOTION_SENSING",//done
//   6: "COCO_STD_CAP_OCCUPANCY_SENSING",//done
//   7: "COCO_STD_CAP_CONTACT_SENSING",//done
//   8: "COCO_STD_CAP_FLUID_LEVEL_MEASUREMENT",//done
//   9: "COCO_STD_CAP_FIRE_SENSING",//done
//   10: "COCO_STD_CAP_TEMPERATURE_MEASUREMENT",//done
//   11: "COCO_STD_CAP_ILLUMINANCE_MEASUREMENT",//done
//   12: "COCO_STD_CAP_POWER_LEVEL_MEASUREMENT",
//   13: "COCO_STD_CAP_TUNNEL_CONTROL",
//   14: "COCO_STD_CAP_REL_HUMIDITY_MEASUREMENT",
//   15: "COCO_STD_CAP_KEYPRESS_SENSING",
//   16: "COCO_STD_CAP_WARNING_DEV_CONTROL",
//   17: "COCO_STD_CAP_NETWORK_CONFIGURATION",
//   18: "COCO_STD_CAP_MEDIA_STREAM",
//   19: "COCO_STD_CAP_STORAGE_CONFIG",
//   20: "COCO_STD_CAP_STORAGE_CONTROL",
//   21: "COCO_STD_CAP_MOTOR_CTRL",
//   22: "COCO_STD_CAP_IMAGE_CTRL",
//   23: "COCO_STD_CAP_SNAPSHOT"
// }

const iconMaps: any = {
  "Resources": {
    "AC": "https://static-assets.getcoco.buzz/images/coco-home/resources/ac.png",
    "AIR_QUALITY_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/" +
      "resources/air-quality-sensor.png",
    "BULB": "https://static-assets.getcoco.buzz/images/coco-home/resources/bulb.png",
    "CAMERA": "https://static-assets.getcoco.buzz/images/coco-home/resources" +
      "/camera.png",
    "CHIMNEY": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "chimney.png",
    "CONTACT_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "contact-sensor.png",
    "DOOR_BELL": "https://static-assets.getcoco.buzz/images/coco-home/resources" +
      "/door-bell.png",
    "DOOR_LOCK": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "door-lock.png",
    "ENERGY_METER": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "energy-meter.png",
    "FAN": "https://static-assets.getcoco.buzz/images/coco-home/resources/fan.png",
    "FIRE_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "fire-sensor.png",
    "FLOOD_ALERT": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "flood-sensor.png",
    "GARAGE_SHUTTER": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "garage-shutter.png",
    "GAS_LEAK_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/" +
      "resources/gas-leak-sensor.png",
    "GAS_VALVE": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "gas-valve.png",
    "GATE": "https://static-assets.getcoco.buzz/images/coco-home/resources/gate.png",
    "GEYSER": "https://static-assets.getcoco.buzz/images/coco-home/" +
      "resources/geyser.png",
    "HUMIDITY_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/resources" +
      "/humidity-sensor.png",
    "ILLUMINATION_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/" +
      "resources/illumination-sensor.png",
    "IR_BLASTER": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "ir-blaster.png",
    "KEY_FOB": "https://static-assets.getcoco.buzz/images/coco-home/resources/keyfob.png",
    "MOTION_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "motion-sensor.png",
    "PLUG": "https://static-assets.getcoco.buzz/images/coco-home/resources/plug.png",
    "REFRIGERATOR": "https://static-assets.getcoco.buzz/images/coco-home/resources" +
      "/refrigerator.png",
    "RELAY": "https://static-assets.getcoco.buzz/images/coco-home/resources/relay.png",
    "SIREN": "https://static-assets.getcoco.buzz/images/coco-home/resources/siren.png",
    "SPEAKER": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "speaker.png",
    "SPRINKLERS": "https://static-assets.getcoco.buzz/images/coco-home/resources" +
      "/sprinkler.png",
    "SWITCH": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "switch.png",
    "TEMPERATURE_SENSOR": "https://static-assets.getcoco.buzz/images/coco-home/" +
      "resources/temperature-sensor.png",
    "THERMOSTAT": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "thermostat.png",
    "TV": "https://static-assets.getcoco.buzz/images/coco-home/resources/tv.png",
    "WASHING_MACHINE": "https://static-assets.getcoco.buzz/images/coco-home/" +
      "resources/washing-machine.png",
    "WATER_PUMP": "https://static-assets.getcoco.buzz/images/coco-home/resources/ " +
      "water-pump.png",
    "WATER_VALVE": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "water-valve.png",
    "WINDOW_BLINDS": "https://static-assets.getcoco.buzz/images/coco-home/resources/" +
      "window-blinds.png"
  },
  "Scenes": {
    "CELEBRATION": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "celebration.png",
    "COFFEE_TIME": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "coffee-time.png",
    "DINNER": "https://static-assets.getcoco.buzz/images/coco-home/scenes/dinner.png",
    "GOOD_MORNING": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "good-morning.png",
    "GOOD_NIGHT": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "good-night.png",
    "MEAL": "https://static-assets.getcoco.buzz/images/coco-home/scenes/meal.png",
    "MOVIE": "https://static-assets.getcoco.buzz/images/coco-home/scenes/movie.png",
    "PARTY_TIME": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "party.png",
    "RELAXATION": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "relaxation.png",
    "SLEEP": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "sleep.png",
    "STUDY": "https://static-assets.getcoco.buzz/images/coco-home/scenes/" +
      "study.png"
  }
};

// default resource icon
const DEFAULT_RESOURCE_ICON =
  "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";

// // default resource icon
// const DEFAULT_SCENE_ICON =
//   "https://static-assets.getcoco.buzz/images/coco-home/scenes/scene.png";

/**
* Get resource icon based on metadata
* @param {String} metadata - meta data of resource
*/
export const getResourceIcon = (metadata: any) => {
  return iconMaps['Resources'][metadata] || DEFAULT_RESOURCE_ICON;
};

// /**
// * Get scene icon based on metadata
// * @param {String} metadata - meta data of scene
// */
// export const getSceneIcon = (metadata:any) => {
//   return iconMaps['Scenes'][metadata] || DEFAULT_SCENE_ICON;
// };

// export const getCapabilityName = (_capabalityId: string | number) => {
//   let _capabilityName;
//   return _capabilityName = CAPABILITY_NAME[_capabalityId];
// };

// /**
// * Get attribute icon based on capabilityId and attributeId
// * @param {String} metadata - meta data of scene
// */
// export const getAttributeIcon = (capabilityId:any, attributeId:any) => {
//   let _parentCapabilityId = CAPABILITY_ID[capabilityId];
//   var _attributeId;
//   var _attributeName;
//   var _attributeIconURL: any;

//   switch (_parentCapabilityId) {
//     case "COCO_STD_CAP_ON_OFF_CONTROL": { //don't need - No attribute id
//       _attributeId = ATTR_ON_OFF_ID[attributeId];
//       _attributeName = ATTR_ON_OFF_NAME[attributeId];

//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }

//     case "COCO_STD_CAP_LEVEL_CTRL": {
//       _attributeId = ATTR_LEVEL_ID[attributeId];
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/level-control.png";
//       return _attributeIconURL;
//       break;
//     }

//     case "COCO_STD_CAP_COLOR_CTRL": { //don't need - No attribute id
//       _attributeId = ATTR_ON_OFF_ID[attributeId];
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/color-control.png";
//       return _attributeIconURL;
//       break;
//     }

//     case "COCO_STD_CAP_LOCK_CONTROL": {//don't need - No attribute id
//       _attributeId = ATTR_ON_OFF_ID[attributeId]
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/lock.png";
//       return _attributeIconURL;
//       break;
//     }

//     case "COCO_STD_CAP_ENERGY_METERING": { //don't need - No attribute id
//       _attributeId = ATTR_METER_ID[attributeId]
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/meter.png";
//       break;
//     }
//     case "COCO_STD_CAP_MOTION_SENSING": {
//       _attributeId = ATTR_MOTION_ID[attributeId];

//       switch (_attributeId) {
//         case "COCO_STD_ATTR_MOTION_DETECTED_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/motion-detected.png";
//           break;
//       }
//     }
//     case "COCO_STD_CAP_OCCUPANCY_SENSING": {
//       _attributeId = ATTR_OCCUPANCY_ID[attributeId];

//       switch (_attributeId) {
//         case "COCO_STD_ATTR_PRESENCE_DETECTED_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/presence-detected.png";
//           break;

//         case "COCO_STD_ATTR_OCCUPANCY_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/occupancy-detected.png";
//           break;
//       }
//       break;
//     }
//     case "COCO_STD_CAP_CONTACT_SENSING": {
//       _attributeId = ATTR_CONTACT_SENSING_ID[attributeId];
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/contact-sensor.png";
//       break;
//     }
//     case "COCO_STD_CAP_FLUID_LEVEL_MEASUREMENT": {
//       _attributeId = ATTR_FLUID_LEVEL_ID[attributeId];

//       switch (_attributeId) {
//         case "COCO_STD_ATTR_WATER_LEAK_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/water-leak.png";
//           break;

//         case "COCO_STD_ATTR_WATER_OVERFLOW_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/overflow.png";
//           break;
//       }
//       break;
//     }
//     case "COCO_STD_CAP_FIRE_SENSING": {
//       _attributeId = ATTR_FIRE_SENSING_ID[attributeId];

//       switch (_attributeId) {
//         case "COCO_STD_ATTR_CO_DETECTED_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/co.png";
//           break;

//         case "COCO_STD_ATTR_COOKING_IND_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/cooking-gas.png";
//           break;

//         case "COCO_STD_ATTR_HEAT_DETECTED_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/heat.png";
//           break;

//         case "COCO_STD_ATTR_OVERHEAT_DETECTED":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/overheat.png";
//           break;

//         case "COCO_STD_ATTR_SMOKE_DETECTED":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/smoke-detected.png";
//           break;

//         case "COCO_STD_ATTR_COLD_DETECTED_FLAG":
//           return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/motion-detected.png";
//           break;
//       }
//       break;
//     }
//     case "COCO_STD_CAP_TEMPERATURE_MEASUREMENT": {
//       _attributeId = ATTR_TEMPERATURE_ID[attributeId];
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/temperature.png";
//       break;
//     }

//     case "COCO_STD_CAP_ILLUMINANCE_MEASUREMENT": {
//       _attributeId = ATTR_ILLUMINANCE_ID[attributeId];
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/illuminance.png";
//       break;
//     }
//     case "COCO_STD_CAP_POWER_LEVEL_MEASUREMENT": {
//       _attributeId = ATTR_POWER_TYPES_ID[attributeId];

//       // switch(_attributeId){
//       //   case "COCO_STD_ATTR_PRESENCE_DETECTED_FLAG":
//       //   return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/motion-detected.png";
//       //   break;
//       //
//       //   case "COCO_STD_ATTR_OCCUPANCY_FLAG":
//       //   return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/motion-detected.png";
//       //   break;
//       // }

//     }
//     case "COCO_STD_CAP_TUNNEL_CONTROL": {
//       _attributeId = ATTR_TUNNEL_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//     case "COCO_STD_CAP_REL_HUMIDITY_MEASUREMENT": {
//       _attributeId = ATTR_HUMIDITY_ID[attributeId];
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/humidity.png";
//       break;
//     }
//     case "COCO_STD_CAP_KEYPRESS_SENSING": {
//       _attributeId = ATTR_KEYPRESS_SENSING_ID[attributeId];
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/keypress.png";
//       break;
//     }
//     case "COCO_STD_CAP_WARNING_DEV_CONTROL": { //don't need - No attribute id
//       _attributeId = ATTR_WARNING_ID[attributeId];
//       return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/siren.png";
//       break;
//     }


//     case "COCO_STD_CAP_NETWORK_CONFIGURATION": {
//       // _attributeId = ATTR_NE[attributeId];

//       // switch(_attributeId){
//       //   case "COCO_STD_ATTR_PRESENCE_DETECTED_FLAG":
//       //   return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/motion-detected.png";
//       //   break;
//       //
//       //   case "COCO_STD_ATTR_OCCUPANCY_FLAG":
//       //   return _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/attributes/motion-detected.png";
//       //   break;
//       // }
//       break;
//     }
//     case "COCO_STD_CAP_MEDIA_STREAM": {
//       _attributeId = ATTR_MEDIA_STREAM_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//     case "COCO_STD_CAP_STORAGE_CONFIG": {
//       _attributeId = ATTR_STORAGE_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//     case "COCO_STD_CAP_STORAGE_CONTROL": {
//       _attributeId = ATTR_STORAGE_CONTROL_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//     case "COCO_STD_CAP_MOTOR_CTRL": {
//       _attributeId = ATTR_MOTOR_TYPES_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//     case "COCO_STD_CAP_IMAGE_CTRL": {
//       _attributeId = ATTR_IMAGE_CTRL_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//     case "COCO_STD_CAP_SNAPSHOT": {
//       _attributeId = ATTR_SNAPSHOT_ID[attributeId];
//       //Using default Resource ICON since icon not available
//       _attributeIconURL = "https://static-assets.getcoco.buzz/images/coco-home/resources/resource.png";
//       return _attributeIconURL;
//       break;
//     }
//   }
//   // return _attributeIconURL;
// };

// /**
// * Get attribute icon based on capabilityId and attributeId
// * @param {String} metadata - meta data of scene
// */
// export const getAttributeName = (capabilityId: string | number, attributeId: string | number) => {
//   let _parentCapabilityId = CAPABILITY_ID[capabilityId];
//   var _attributeId;
//   var _attributeName;
//   var _attributeIconURL: any;

//   switch (_parentCapabilityId) {
//     case "COCO_STD_CAP_ON_OFF_CONTROL": { //don't need - No attribute id
//       _attributeId = ATTR_ON_OFF_ID[attributeId];
//       _attributeName = ATTR_ON_OFF_NAME[attributeId];

//       return _attributeName;
//       break;
//     }

//     case "COCO_STD_CAP_LEVEL_CTRL": {
//       _attributeId = ATTR_LEVEL_ID[attributeId];
//       _attributeName = ATTR_LEVEL_NAME[attributeId];

//       return _attributeName;
//       break;
//     }

//     case "COCO_STD_CAP_COLOR_CTRL": { //don't need - No attribute id
//       _attributeId = ATTR_COLOR_ID[attributeId];
//       _attributeName = ATTR_COLOR_NAME[attributeId];

//       return _attributeName;
//       break;
//     }

//     case "COCO_STD_CAP_LOCK_CONTROL": {//don't need - No attribute id
//       _attributeId = ATTR_LOCK_ID[attributeId]
//       _attributeName = ATTR_LOCK_NAME[attributeId];

//       return _attributeName;
//       break;
//     }

//     case "COCO_STD_CAP_ENERGY_METERING": { //don't need - No attribute id
//       _attributeId = ATTR_METER_ID[attributeId]
//       _attributeName = ATTR_METER_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_MOTION_SENSING": {
//       _attributeId = ATTR_MOTION_ID[attributeId];
//       _attributeName = ATTR_MOTION_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_OCCUPANCY_SENSING": {
//       _attributeId = ATTR_OCCUPANCY_ID[attributeId];
//       _attributeName = ATTR_OCCUPANCY_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_CONTACT_SENSING": {
//       _attributeId = ATTR_CONTACT_SENSING_ID[attributeId];
//       _attributeName = ATTR_CONTACT_SENSING_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_FLUID_LEVEL_MEASUREMENT": {
//       _attributeId = ATTR_FLUID_LEVEL_ID[attributeId];
//       _attributeName = ATTR_FLUID_LEVEL_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_FIRE_SENSING": {
//       _attributeId = ATTR_FIRE_SENSING_ID[attributeId];
//       _attributeName = ATTR_FIRE_SENSING_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_TEMPERATURE_MEASUREMENT": {
//       _attributeId = ATTR_TEMPERATURE_ID[attributeId];
//       _attributeName = ATTR_TEMPERATURE_NAME[attributeId];

//       return _attributeName;
//       break;
//     }

//     case "COCO_STD_CAP_ILLUMINANCE_MEASUREMENT": {
//       _attributeId = ATTR_ILLUMINANCE_ID[attributeId];
//       _attributeName = ATTR_ILLUMINANCE_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_POWER_LEVEL_MEASUREMENT": {
//       _attributeId = ATTR_POWER_TYPES_ID[attributeId];
//       _attributeName = ATTR_POWER_TYPES_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_TUNNEL_CONTROL": {
//       _attributeId = ATTR_TUNNEL_ID[attributeId];
//       _attributeName = ATTR_TUNNEL_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_REL_HUMIDITY_MEASUREMENT": {
//       _attributeId = ATTR_HUMIDITY_ID[attributeId];
//       _attributeName = ATTR_HUMIDITY_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_KEYPRESS_SENSING": {
//       _attributeId = ATTR_KEYPRESS_SENSING_ID[attributeId];
//       _attributeName = ATTR_KEYPRESS_SENSING_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_WARNING_DEV_CONTROL": { //don't need - No attribute id
//       _attributeId = ATTR_WARNING_ID[attributeId];
//       _attributeName = ATTR_WARNING_NAME[attributeId];

//       return _attributeName;
//       break;
//     }


//     case "COCO_STD_CAP_NETWORK_CONFIGURATION": {
//       _attributeId = ATTR_NETWORK_CONFIG_ID[attributeId];
//       _attributeName = ATTR_NETWORK_CONFIG_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_MEDIA_STREAM": {
//       _attributeId = ATTR_MEDIA_STREAM_ID[attributeId];
//       _attributeName = ATTR_MEDIA_STREAM_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_STORAGE_CONFIG": {
//       _attributeId = ATTR_STORAGE_ID[attributeId];
//       _attributeName = ATTR_STORAGE_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_STORAGE_CONTROL": {
//       _attributeId = ATTR_STORAGE_CONTROL_ID[attributeId];
//       _attributeName = ATTR_STORAGE_CONTROL_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_MOTOR_CTRL": {
//       _attributeId = ATTR_MOTOR_TYPES_ID[attributeId];
//       _attributeName = ATTR_MOTOR_TYPES_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_IMAGE_CTRL": {
//       _attributeId = ATTR_IMAGE_CTRL_ID[attributeId];
//       _attributeName = ATTR_IMAGE_CTRL_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//     case "COCO_STD_CAP_SNAPSHOT": {
//       _attributeId = ATTR_SNAPSHOT_ID[attributeId];
//       _attributeName = ATTR_SNAPSHOT_NAME[attributeId];

//       return _attributeName;
//       break;
//     }
//   }
//   // return _attributeIconURL;
// };

// /**
// * Get attribute Value based on capability Id and Data Type
// * @param {String} capabilityId and Data type - meta data of scene
// */
// export const getAttributeValue = (capabilityId: string | number, attributeId: any, dataType: any, value: string) => {
//   let _capabilityId = CAPABILITY_ID[capabilityId];
//   let _attributeId = getAttributeId(_capabilityId, attributeId);
//   let _dataType = dataType;
//   var _value: String = "--";

//   let temp = value;
//   switch (_dataType) {
//     // .COCO_STD_DATA_TYPE_BOOLEAN - need to addd stuff

//     case 0: {
//       switch (_capabilityId) {
//         case "COCO_STD_CAP_ON_OFF_CONTROL": {
//           value = temp ? "On" : "Off";
//           return value;
//           break;
//         }

//         case "COCO_STD_CAP_LOCK_CONTROL": {
//           value = temp ? "Unlock" : "Lock";
//           return value;
//           break;
//         }

//         case "COCO_STD_CAP_CONTACT_SENSING": {
//           value = temp ? "Open" : "Closed";
//           return value;
//           break;
//         }

//         case "COCO_STD_CAP_MOTION_SENSING": {
//           switch (_attributeId) {
//             case "COCO_STD_ATTR_MOTION_DETECTED_FLAG": {
//               if (temp == "1") {
//                 return value = "Detected";
//               }
//               else {
//                 return value = "Not Detected";
//               }
//             }
//           }
//           // default:
//           //   value = temp ? "True" : "False"
//           // }
//         }
//         case "COCO_STD_CAP_OCCUPANCY_SENSING":
//         case "COCO_STD_CAP_FIRE_SENSING":
//         case "COCO_STD_CAP_FLUID_LEVEL_MEASUREMENT":
//         case "COCO_STD_CAP_OCCUPANCY_SENSING": {
//           value = temp ? "Detected" : "Not Detected";
//           return value;
//         }
//         default: {
//           return temp;
//         }

//       }
//     }
//     case 22: {
//       switch (_capabilityId) {
//         // case .COCO_STD_CAP_ON_OFF_CONTROL:
//         //   value = temp ? "On" : "Off"
//         // case .COCO_STD_CAP_LOCK_CONTROL:
//         //   value = temp ? "Unlock" : "Lock"
//         // case .COCO_STD_CAP_CONTACT_SENSING:
//         //   value = temp ? "Open" : "Closed"
//         case "COCO_STD_CAP_ILLUMINANCE_MEASUREMENT": {
//           return temp;
//           break;
//         }
//         default: {
//           return temp;
//         }
//       }
//     }
//   }
// };

// export const getAttributeId = (_capabilityId: any, attributeId: string | number) => {
//   let _attributeId;
//   switch (_capabilityId) {
//     case "COCO_STD_CAP_LEVEL_CTRL": {
//       return _attributeId = ATTR_LEVEL_ID[attributeId];
//     }
//     case "COCO_STD_CAP_MOTION_SENSING": {
//       return _attributeId = ATTR_MOTION_ID[attributeId];
//     }
//     case "COCO_STD_CAP_ILLUMINANCE_MEASUREMENT": {
//       return _attributeId = ATTR_ILLUMINANCE_ID[attributeId];
//     }
//   }
// };

export const COCOHomeIcons = { getResourceIcon };
