import 'dart:convert';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:fyp/components/SingleDoctor.dart';
import 'package:fyp/globals.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class DoctorDetails extends StatefulWidget {
  String id;
  String doctorimage;
  String doctorspeciality;
  String doctorname;
  var available;
  var bookedDate;

  DoctorDetails(
      {required this.id,
      required this.doctorimage,
      required this.doctorname,
      required this.doctorspeciality,
      required this.available,
      required this.bookedDate});

  @override
  _DoctorDetailsState createState() => _DoctorDetailsState();
}

class _DoctorDetailsState extends State<DoctorDetails> {
  String? selecteddate;

  DateTime today = new DateTime.now();
  String selectedStartDay = '';

  var Avtime;
  String BookingDate = '';
  String Bookingfrom = '';
  String Bookingto = '';
  String BookingTimeid = '';

  String? bookdate;
  bool pressed = false;

  String returnMonth() {
    return DateFormat.MMMM().format(DateTime.now());
  }

  bookDoctor(String Dateid, String Timeid, String Timefrom, String Timeto,
      String selectedday) async {
    String url = "https://fypapp123.herokuapp.com/api/user/book/doctor/" +
        widget.id +
        "/" +
        Dateid +
        "/availabletime/" +
        Timeid;

    Map body = {"date": selectedday, "from": Timefrom, "to": Timeto};

    var res = await http.put(Uri.parse(url),
        headers: <String, String>{'x-auth-token': token}, body: body);
    var jsonResponse;
    // Api status
    print(res.statusCode);
    if (res.statusCode == 200) {
      Get.snackbar('Success', 'Booking Completed',
          snackPosition: SnackPosition.BOTTOM);
      jsonResponse = json.decode(res.body);
      if (jsonResponse != null) {
        Get.snackbar('Message', jsonResponse['msg'],
            snackPosition: SnackPosition.BOTTOM);
        print(jsonResponse['msg']);
      }
    } else if (res.statusCode == 400) {
      if (jsonResponse != null) {
        Get.snackbar('Message', jsonResponse['msg'],
            snackPosition: SnackPosition.BOTTOM);
      } else {
        Get.snackbar('Error', 'Please Try Again Later',
            snackPosition: SnackPosition.BOTTOM);
      }
    } else {
      Get.snackbar('Error', 'Please Try Again Later',
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(bottom: 20),
              height: 200,
              decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30))),
              child: Container(
                child: Row(
                  children: [
                    Container(
                        height: 120,
                        width: 120,
                        margin: const EdgeInsets.only(bottom: 10),
                        child: CircleAvatar(
                          backgroundImage: NetworkImage(widget.doctorimage),
                          backgroundColor: Colors.white,
                        )),
                    Container(
                      margin: const EdgeInsets.only(left: 20),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            margin: const EdgeInsets.only(top: 20),
                            child: Text(
                              widget.doctorname,
                              style: const TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700),
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            child: Text(
                              widget.doctorspeciality,
                              style: const TextStyle(
                                  fontSize: 15,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w300),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
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
                margin: const EdgeInsets.symmetric(vertical: 20),
                child: IconButton(
                  icon: Icon(
                    Icons.calendar_month,
                    size: 50,
                    color: Theme.of(context).primaryColor,
                  ),
                  onPressed: () async {
                    DateTime? startDate = await showDatePicker(
                        builder: (context, child) => Theme(
                            data: ThemeData().copyWith(
                                colorScheme: ColorScheme.dark(
                                    primary:
                                        Theme.of(context).secondaryHeaderColor,
                                    onPrimary: Theme.of(context).primaryColor,
                                    surface: Theme.of(context).primaryColor,
                                    onSurface: Colors.black),
                                dialogBackgroundColor: Colors.blueGrey[100]),
                            child: child!),
                        context: context,
                        initialDate: today,
                        firstDate: today,
                        lastDate: today.add(const Duration(days: 7)));
                    if (startDate == null) {
                    } else {
                      setState(() {
                        String theday = startDate.toString();
                        selectedStartDay = theday.substring(0, 10);
                        // "${startDate.year}-${startDate.month}-${startDate.day}";
                      });
                    }

                    //to show available time for selected days
                    for (var i = 0; i < widget.available.length; i++) {
                      if (selectedStartDay == widget.available[i]['date']) {
                        setState(() {
                          Avtime = widget.available[i]['time'];
                          BookingDate = widget.available[i]['_id'];
                        });

                        break;
                      } else {
                        setState(() {
                          Avtime = [];
                        });
                      }
                    }
                  },
                ),
              ),
            ),
            Container(
                height: 70,
                margin: const EdgeInsets.all(5),
                child: Avtime == null
                    ? const Center(
                        child: Text(
                          'No TimeSlot Available. Please select some other day',
                          style: TextStyle(color: Colors.grey, fontSize: 16),
                        ),
                      )
                    : ListView.builder(
                        itemCount: Avtime.length,
                        scrollDirection: Axis.horizontal,
                        shrinkWrap: true,
                        itemBuilder: (context, int index) {
                          return timeslot(Avtime[index]['_id'],
                              Avtime[index]['from'], Avtime[index]['to']);
                        })),
            selectedStartDay.isEmpty || Bookingfrom.isEmpty
                ? Container()
                : Container(
                    margin: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        const Center(
                          child: Text("Booking Details",
                              style: TextStyle(
                                color: Colors.amber,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              )),
                        ),
                        Container(
                          margin: const EdgeInsets.only(top: 20),
                          child: Row(
                            children: [
                              Container(
                                child: Text('Doctor Name :'),
                              ),
                              Container(
                                child: Text(widget.doctorname),
                              )
                            ],
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.only(top: 20),
                          child: Row(
                            children: [
                              Container(
                                child: Text('Booking Date :'),
                              ),
                              Container(
                                child: Text(selectedStartDay),
                              )
                            ],
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.only(top: 20),
                          child: Row(
                            children: [
                              Container(
                                child: Text('Booking Time :'),
                              ),
                              Container(
                                child: Text(Bookingfrom),
                              ),
                              Container(
                                child: Text(' - '),
                              ),
                              Container(
                                child: Text(Bookingto),
                              )
                            ],
                          ),
                        ),
                        Center(
                          child: SizedBox(
                            width: 100,
                            child: MaterialButton(
                              color: Theme.of(context).primaryColor,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10)),
                              onPressed: () {
                                bookDoctor(BookingDate, BookingTimeid,
                                    Bookingfrom, Bookingto, selectedStartDay);
                              },
                              child: const Text(
                                'Book Now',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  Widget timeslot(
    String id,
    String from,
    String to,
  ) {
    return InkWell(
      onTap: () {
        setState(() {
          BookingTimeid = id;
          Bookingfrom = from;
          Bookingto = to;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(right: 15),
        width: 180,
        decoration: BoxDecoration(
          color: Colors.blueGrey[200],
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              child: Text(
                from,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Container(
              child: const Text(
                ' - ',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Container(
              child: Text(
                to,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
