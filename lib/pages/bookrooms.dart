import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:fyp/globals.dart';

class BookRoom extends StatefulWidget {
  String roomType;
  String roomDescription;
  String roomPrice;
  String roomPhoto;
  int roomQuantity;
  String roomId;
  int availablenumber;

  BookRoom({
    required this.roomType,
    required this.roomPhoto,
    required this.roomDescription,
    required this.roomPrice,
    required this.roomQuantity,
    required this.roomId,
    required this.availablenumber,
  });

  @override
  _BookRoomState createState() => _BookRoomState();
}

class _BookRoomState extends State<BookRoom> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  String? selecteddate;
  DateTime today = DateTime.now();
  DateTime selectedStartDay = DateTime.now();
  DateTime? selectedEndDay;
  String returnMonth() {
    return DateFormat.MMMM().format(DateTime.now());
  }

  bookRoom() async {
    String url =
        "https://fypapp123.herokuapp.com/api/user/book/room/" + widget.roomId;
    Map body = {
      "from": selectedStartDay.toString(),
      "to": selectedEndDay.toString()
    };
    print(body);
    var res = await http.post(Uri.parse(url),
        headers: <String, String>{'x-auth-token': token}, body: body);
    var jsonResponse;
    // Api status
    if (res.statusCode == 200) {
      Get.snackbar('Success',
          'Booking has been Requested. You will be contacted for confirmation soon',
          snackPosition: SnackPosition.BOTTOM);
      jsonResponse = json.decode(res.body);
      if (jsonResponse != null) {
        setState(() {
          widget.availablenumber = jsonResponse['availableRooms'];
        });
        print(jsonResponse['msg']);
      } else {
        Get.snackbar('Error', 'Please Try Again Later',
            snackPosition: SnackPosition.BOTTOM);
      }
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
        title: Text("Room"),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(bottom: 20),
              height: 370,
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
                    padding: const EdgeInsets.only(top: 10, bottom: 10),
                    alignment: Alignment.center,
                    margin: const EdgeInsets.only(bottom: 10),
                    child: Text(
                      widget.roomType,
                      style: const TextStyle(
                          fontSize: 22,
                          color: Colors.white,
                          fontWeight: FontWeight.w700),
                    ),
                  ),
                  Center(
                    child: Container(
                        alignment: Alignment.center,
                        height: 140,
                        width: 180,
                        margin: const EdgeInsets.only(bottom: 10),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20)),
                        child: Image.network(widget.roomPhoto)),
                  ),
                  Container(
                    padding: const EdgeInsets.all(10),
                    child: Text(
                      widget.roomDescription,
                      style: const TextStyle(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.w300),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(10),
                    child: Text(
                      "Room Price per Day: Rs " + widget.roomPrice,
                      style: const TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            Row(children: <Widget>[
              const Expanded(
                  child: Divider(
                thickness: 1,
              )),
              Text(
                returnMonth(),
                style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontSize: 25,
                    fontWeight: FontWeight.w700),
              ),
              const Expanded(
                  child: Divider(
                thickness: 1,
              )),
            ]),
            Center(
              child: Container(
                margin: const EdgeInsets.only(top: 10),
                child: Text(
                  'Select booking date',
                  style: TextStyle(
                      color: Colors.grey[400],
                      fontWeight: FontWeight.bold,
                      fontSize: 16),
                ),
              ),
            ),
            Container(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    margin: const EdgeInsets.all(10),
                    child: MaterialButton(
                      shape: const RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.all(Radius.circular(10.0))),
                      padding: const EdgeInsets.all(10),
                      child: const Text(
                        'Start Date',
                        style: TextStyle(color: Colors.white),
                      ),
                      color: Theme.of(context).primaryColor,
                      onPressed: () async {
                        DateTime? startDate = await showDatePicker(
                            builder: (context, child) => Theme(
                                data: ThemeData().copyWith(
                                    colorScheme: ColorScheme.dark(
                                        primary: Theme.of(context)
                                            .secondaryHeaderColor,
                                        onPrimary:
                                            Theme.of(context).primaryColor,
                                        surface: Theme.of(context).primaryColor,
                                        onSurface: Colors.black),
                                    dialogBackgroundColor:
                                        Colors.blueGrey[100]),
                                child: child!),
                            context: context,
                            initialDate: today,
                            firstDate: today,
                            lastDate: today.add(const Duration(days: 7)));
                        if (startDate == null) {
                        } else {
                          setState(() {
                            selectedStartDay = startDate;
                          });
                        }
                        print(selectedStartDay);
                      },
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.all(20),
                    child: MaterialButton(
                      shape: const RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.all(Radius.circular(10.0))),
                      child: const Text(
                        'End Date',
                        style: TextStyle(color: Colors.white),
                      ),
                      color: Theme.of(context).primaryColor,
                      onPressed: () async {
                        DateTime? endDate = await showDatePicker(
                            builder: (context, child) => Theme(
                                data: ThemeData().copyWith(
                                    colorScheme: ColorScheme.dark(
                                        primary: Theme.of(context)
                                            .secondaryHeaderColor,
                                        onPrimary:
                                            Theme.of(context).primaryColor,
                                        surface: Theme.of(context).primaryColor,
                                        onSurface: Colors.black),
                                    dialogBackgroundColor:
                                        Colors.blueGrey[100]),
                                child: child!),
                            context: context,
                            initialDate:
                                selectedStartDay.add(const Duration(days: 1)),
                            firstDate:
                                selectedStartDay.add(const Duration(days: 1)),
                            lastDate:
                                selectedStartDay.add(const Duration(days: 1)));
                        if (endDate == null) {
                        } else {
                          setState(() {
                            selectedEndDay = endDate;
                          });
                        }
                        print(selectedEndDay);
                      },
                    ),
                  )
                ],
              ),
            ),
            Center(
              child: Container(
                margin: const EdgeInsets.all(20),
                child: MaterialButton(
                  shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(10.0))),
                  color: Colors.red[800],
                  child: const Text(
                    'Book Now!',
                    style: TextStyle(color: Colors.white),
                  ),
                  onPressed: () {
                    bookRoom();
                  },
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
