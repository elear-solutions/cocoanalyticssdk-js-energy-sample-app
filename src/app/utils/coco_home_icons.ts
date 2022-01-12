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

/**
* Get resource icon based on metadata
* @param {String} metadata - meta data of resource
*/
export const getResourceIcon = (metadata: any) => {
  return iconMaps['Resources'][metadata] || DEFAULT_RESOURCE_ICON;
};

export const COCOHomeIcons = { getResourceIcon };
