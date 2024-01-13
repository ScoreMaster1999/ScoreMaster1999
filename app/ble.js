import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const SERVICE_UUID = "77b9bd36-de32-46bf-b340-9276b4c5d237"
const CHARACTERISTIC_UUID = "361ef854-cd9f-4213-afb3-d7d3a1845f7f"

export default function useBLE() {
    const bleManager = use(() => new BleManager(), [])
    const [devices, setDevices] = useState([])
    const [connectedDevice, setConnectedDevice] = useState(null)
    const [score, setScore] = useState(0);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
    
        return (
          bluetoothScanPermission === "granted" &&
          bluetoothConnectPermission === "granted" &&
          fineLocationPermission === "granted"
        );
      };
    const requestPermissions = async () => {
        if (Platform.OS === "android") {
          if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
              }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } else {
            const isAndroid31PermissionsGranted =
              await requestAndroid31Permissions();
    
            return isAndroid31PermissionsGranted;
          }
        } else {
          return true;
        }
      };
    const startScan = () => {
        bleManager.startDeviceScan(null, {
        allowDuplicates: false,
        },
        async (error, device) => {
        if (error) {
            bleManager.stopDeviceScan()
        }
        if (device.title === "ScoreMaster1999") {
            setDevices([...devices, device])
            bleManager.stopDeviceScan()
        }
        }
        )
    }

    const connectToDevice = async (device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
          } catch (e) {
            console.log("FAILED TO CONNECT", e);
          }
    }

    const onScoreUpdate = (error, characteristic) => {
        if (error) {
            console.log(error);
            return -1;
          } else if (!characteristic?.value) {
            console.log("No Data was recieved");
            return -1;
          }
        
          const rawData = base64.decode(characteristic.value)
          let newscore = -1;
          
          setScore(newscore)
    }

    const startStreamingData = async (device) => {
        if (device) {
          device.monitorCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            onScoreUpdate
          );
        } else {
          console.log("No Device Connected");
        }
      };

}