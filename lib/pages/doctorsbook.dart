import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fyp/doctor_details.dart';
import 'package:http/http.dart' as http;
import 'package:fyp/components/doctors.dart';
import 'package:fyp/globals.dart';

class BookDoctor extends StatefulWidget {
  const BookDoctor({Key? key}) : super(key: key);

  @override
  _BookDoctorState createState() => _BookDoctorState();
}

class _BookDoctorState extends State<BookDoctor> {
  String doctorImageUrl =
      'https://fypapp123.herokuapp.com/api/category/doctor/image/';

  // get doctors info
  getdoctorList() async {
    String url = "https://fypapp123.herokuapp.com/api/category/doctors";

    // ignore: prefer_typing_uninitialized_variables
    var jsonResponse;
    var res = await http
        .get(Uri.parse(url), headers: <String, String>{'x-auth-token': token});
    List<Doctors> doctors = [];

    // Api status
    if (res.statusCode == 200) {
      jsonResponse = json.decode(res.body);

      if (jsonResponse != null) {
        for (var u in jsonResponse) {
          Doctors doctor = Doctors(
              u['_id'],
              u['name'],
              u['contactNo'],
              u['address'],
              u['education'],
              u['speciality'],
              u['doctorPic'],
              u['__v'],
              u['available'],
              u['bookedDate']);
          doctors.add(doctor);
        }

        return doctors;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
        backgroundColor: Theme.of(context).primaryColor,
        appBar: AppBar(
            elevation: 0.0,
            backgroundColor: Theme.of(context).primaryColor,
            leading: IconButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                icon: const Icon(
                  Icons.arrow_back_ios_new_sharp,
                  color: Colors.white,
                ))),
        body: Container(
            decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                )),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 10, left: 20),
                    child: const Text(
                      'Doctors',
                      style: TextStyle(
                        fontSize: 35,
                        color: Color(0xff363636),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 35, left: 20),
                    width: size.width,
                    child: Stack(
                      fit: StackFit.loose,
                      children: [
                        Container(
                          child: const Text(
                            'Available Doctors',
                            style: TextStyle(
                              color: Color(0xff363636),
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 500,
                    margin: const EdgeInsets.only(left: 20, right: 20, top: 30),
                    child: FutureBuilder(
                      future: getdoctorList(),
                      builder: (context, AsyncSnapshot snapshot) {
                        if (snapshot.data == null) {
                          return Container(
                            child: const Center(
                              child: Text("Loading.."),
                            ),
                          );
                        } else {
                          return ListView.builder(
                            itemCount: snapshot.data!.length,
                            scrollDirection: Axis.vertical,
                            shrinkWrap: true,
                            itemBuilder: (context, i) {
                              return doctors(
                                snapshot.data[i].id,
                                (doctorImageUrl + snapshot.data[i].doctorPic),
                                snapshot.data[i].name,
                                snapshot.data[i].education,
                                snapshot.data[i].speciality,
                                snapshot.data[i].available,
                                snapshot.data[i].bookedDate,
                              );
                            },
                          );
                        }
                      },
                    ),
                  ),
                ])));
  }

  Widget doctors(
      String id,
      String doctorimage,
      String doctorname,
      String doctoracademic,
      String doctorspeciality,
      var available,
      var bookedDate) {
    Size size = MediaQuery.of(context).size;
    return GestureDetector(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => DoctorDetails(
                      id: id,
                      doctorimage: doctorimage,
                      doctorname: doctorname,
                      doctorspeciality: doctorspeciality,
                      available: available,
                      bookedDate: bookedDate,
                    )));
      },
      child: Container(
        margin: const EdgeInsets.only(top: 10),
        decoration: BoxDecoration(
            color: Colors.white, borderRadius: BorderRadius.circular(20)),
        height: 90,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
                margin: const EdgeInsets.only(left: 20),
                height: 120,
                width: 70,
                child: CircleAvatar(
                  backgroundImage: NetworkImage(doctorimage),
                  backgroundColor: Colors.white,
                )),
            Container(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 10, left: 10),
                      child: Text(
                        doctorname,
                        style: const TextStyle(
                            color: Colors.black,
                            fontSize: 15,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 10, left: 10),
                      child: Text(
                        doctoracademic,
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 10, left: 10),
                      child: Text(
                        doctorspeciality,
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 10),
                      ),
                    )
                  ]),
            ),
          ],
        ),
      ),
    );
  }
}
