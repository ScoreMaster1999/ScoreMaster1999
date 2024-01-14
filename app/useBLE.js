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

function useBLE() {
    const bleManager = useMemo(() => new BleManager(), [])
    const [devices, setDevices] = useState([])
    const [connD1, setConnd1] = useState(null)
    const [connD2, setConnd2] = useState(null)
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);

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
          return true;
        }
      };
    }
    const isDuplicteDevice = (devices, nextDevice) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const startScan = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes("ScoreMaster")) {
        setDevices((prevState) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

    const connectToDevice = async (device1, device2) => {
        try {
            const device1Connection = await bleManager.connectToDevice(device1.id);
            const device2Connection = await bleManager.connectToDevice(device2.id);
            setConnd1(device1)
            setConnd2(device2)
            await device1Connection.discoverAllServicesAndCharacteristics();
            await device2Connection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(device1Connection, device2Connection);
          } catch (e) {
            console.log("FAILED TO CONNECT", e);
          }
    }

    const onScoreUpdate1 = (error, characteristic) => {
        if (error) {
            console.log(error);
            return -1;
          } else if (!characteristic?.value) {
            console.log("No Data was recieved");
            return -1;
          }
        
          const rawData = base64.decode(characteristic.value)
          let newscore = 0;
          
          for (var i = 0; i < 4; i++) {
            newscore += rawData.charCodeAt(i) << (8 * i)
          }

          setScore1(newscore)
    }

    const onScoreUpdate2 = (error, characteristic) => {
        if (error) {
            console.log(error);
            return -1;
          } else if (!characteristic?.value) {
            console.log("No Data was recieved");
            return -1;
          }
        
          const rawData = base64.decode(characteristic.value)
          let newscore = 0;
          
          for (var i = 0; i < 4; i++) {
            newscore += rawData.charCodeAt(i) << (8 * i)
          }

          setScore2(newscore)
    }
  
    const updateScoreUpdate = (score1, device) => {
      if (device) {
        device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          valueBase64,
        )
      } else {
        console.log("No Device Connected");
      }
    }
    const startStreamingData = async (device1, device2) => {
        if (device1) {
          device1.monitorCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            onScoreUpdate1
          );
        } else {
          console.log("No Device Connected");
        }
        if (device2) {
            device2.monitorCharacteristicForService(
              SERVICE_UUID,
              CHARACTERISTIC_UUID,
              onScoreUpdate2
            );
          } else {
            console.log("No Device Connected");
          }
      };
    const disconnectFromDevice = () => {
        for (connectedDevice in [connD1, connD2]) {
          bleManager.cancelDeviceConnection(connectedDevice.id);
        }
        setConnd1(null)
        setConnd2(null)
      };
    return {
      requestPermissions,
      score1,
      disconnectFromDevice,
      connectToDevice,
      devices,
      connD1,
      connD2,
      setScore1,
      score2,
      setScore2,
      startScan
    }
}

export default useBLE;