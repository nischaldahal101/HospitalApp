import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fyp/globals.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:fyp/globals.dart';

class EmergencyService extends StatefulWidget {
  const EmergencyService({Key? key}) : super(key: key);

  @override
  _EmergencyServiceState createState() => _EmergencyServiceState();
}

class _EmergencyServiceState extends State<EmergencyService> {
  @override
  void initState() {
    getCurrentLocation();

    super.initState();
  }

  var coordinates;

  getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;
    serviceEnabled = await Geolocator.isLocationServiceEnabled();

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        Get.snackbar('', 'Location Permission Denied');
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // Permissions are denied forever, handle appropriately.
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    } else {
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.low);
      if (this.mounted) {
        setState(() {
          latitude = (position.latitude).toString();
          longitude = (position.longitude).toString();
          coordinates = [latitude, longitude];
        });
      }
    }
  }

//send location to admin panel
  sendLocation() async {
    String url = "https://fypapp123.herokuapp.com/api/emergency/" + UserId;

    Map body = {"lat": latitude, "long": longitude};

    var jsonResponse;
    var res = await http.post(Uri.parse(url), body: body);

    print(res.statusCode);
    if (res.statusCode == 200) {
      jsonResponse = json.decode(res.body);
      Get.snackbar('Success', jsonResponse,
          snackPosition: SnackPosition.BOTTOM);
    } else {
      Get.snackbar('Error', 'Error Sending Location.Please try again',
          snackPosition: SnackPosition.BOTTOM);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: Theme.of(context).primaryColor,
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context);
          },
          child: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            margin: const EdgeInsets.only(bottom: 20),
            height: 300,
            decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30))),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  margin: const EdgeInsets.only(top: 20, bottom: 20),
                  alignment: Alignment.center,
                  child: const Text(
                    'Emergency Ambulance Service',
                    style: TextStyle(
                        fontSize: 22,
                        color: Colors.white,
                        fontWeight: FontWeight.w700),
                  ),
                ),
                Center(
                    child: Container(
                  alignment: Alignment.center,
                  height: 50,
                  width: 50,
                  margin: const EdgeInsets.only(bottom: 30),
                  child: Image.asset('assets/map_pointer.png'),
                )),
                Container(
                  padding: const EdgeInsets.all(20),
                  child: const Text(
                    'Emeregency Service provides immediate ambulance service to the people in need of it. You can send your location and just wait for the ambulance to arrive',
                    style: TextStyle(
                        fontSize: 15,
                        color: Colors.white,
                        fontWeight: FontWeight.w300),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(20),
            height: 250,
            decoration: BoxDecoration(
                image: const DecorationImage(
                    image: AssetImage('assets/map.jpg'), fit: BoxFit.fill),
                color: Colors.white70,
                borderRadius: BorderRadius.circular(20)),
          ),
          Center(
            child: Container(
                margin: const EdgeInsets.all(10),
                child: MaterialButton(
                    shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.all(Radius.circular(10.0))),
                    color: Colors.red,
                    child: const Text(
                      'Send current location',
                      style: TextStyle(color: Colors.white),
                    ),
                    onPressed: () {
                      sendLocation();
                    })),
          ),
        ]),
      ),
    );
  }
}
