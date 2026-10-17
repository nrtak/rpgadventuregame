import {validSave} from './game.js';
export function readCheckpoint(storage,slot){for(const suffix of ['', '-backup']){try{const state=JSON.parse(storage.getItem(slot+suffix));if(validSave(state))return {state,recovered:!!suffix}}catch{}}return null}
export function writeCheckpoint(storage,slot,state){try{const previous=storage.getItem(slot),next=JSON.stringify(state);if(previous&&previous!==next){try{if(validSave(JSON.parse(previous)))storage.setItem(slot+'-backup',previous)}catch{}}storage.setItem(slot,next);return true}catch{return false}}
