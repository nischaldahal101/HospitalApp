import 'dart:convert';
import 'package:fyp/pages/about.dart';
import 'package:fyp/pages/categorypage.dart';
import 'package:fyp/pages/user_report.dart';
import 'package:google_fonts/google_fonts.dart';

import 'globals.dart';
import 'package:flutter/material.dart';
import 'package:fyp/components/checkup.dart';
import 'package:fyp/components/currentuser.dart';
import 'package:fyp/components/doctors.dart';
import 'package:fyp/components/rooms.dart';
import 'package:fyp/globals.dart';
import 'package:fyp/pages/bookrooms.dart';
import 'package:fyp/doctor_details.dart';
import 'package:fyp/emergency.dart';
import 'package:fyp/pages/doctorsbook.dart';
import 'package:fyp/pages/user_profile.dart';
import 'package:fyp/authentication/sign_in.dart';
import 'package:http/http.dart' as http;
import 'components/doctors.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List users = [];
  @override
  void initState() {
    getcurrentUser();

    super.initState();
  }

  Future getcurrentUser() async {
    String url = "https://fypapp123.herokuapp.com/api/user/me";

    var res = await http
        .get(Uri.parse(url), headers: <String, String>{'x-auth-token': token});

    // Api status
    if (res.statusCode == 200) {
      var jsonResponse = json.decode(res.body);

      if (mounted) {
        setState(() {
          firstName = jsonResponse['firstName'];
          lastName = jsonResponse['lastName'];
          userReports = jsonResponse['userReports'];
          email = jsonResponse['email'];
          UserId = jsonResponse['_id'];
        });
      }
    }
  }

  String doctorImageUrl =
      'https://fypapp123.herokuapp.com/api/category/doctor/image/';

  String roomImageUrl =
      'https://fypapp123.herokuapp.com/api/category/room/image/';

  String checkupImageUrl =
      'https://fypapp123.herokuapp.com/api/category/checkup/image/';

  //get current user info

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

  //get room info
  getroomList() async {
    String url = "https://fypapp123.herokuapp.com/api/category/rooms";

    // ignore: prefer_typing_uninitialized_variables
    var jsonResponse;
    var res = await http
        .get(Uri.parse(url), headers: <String, String>{'x-auth-token': token});
    List<Rooms> rooms = [];

    // Api status
    if (res.statusCode == 200) {
      jsonResponse = json.decode(res.body);

      if (jsonResponse != null) {
        for (var u in jsonResponse) {
          Rooms room = Rooms(u['_id'], u['name'], u['availableRooms'],
              u['details'], u['price'], u['roomImage'], u['__v']);

          rooms.add(room);
        }

        return rooms;
      }
    }
  }

//get checkup categories
  getcheckupCategory() async {
    String url = "https://fypapp123.herokuapp.com/api/category/checkups";

    // ignore: prefer_typing_uninitialized_variables
    var jsonResponse;
    var res = await http
        .get(Uri.parse(url), headers: <String, String>{'x-auth-token': token});
    List<CheckupCategories> checkups = [];

    // Api status
    if (res.statusCode == 200) {
      jsonResponse = json.decode(res.body);

      if (jsonResponse != null) {
        for (var u in jsonResponse) {
          CheckupCategories checkup = CheckupCategories(
              u['_id'],
              u['name'],
              u['details'],
              u['availableDoctors'],
              u['checkupIcon'],
              u['possibleDiseases'],
              u['__v']);
          checkups.add(checkup);
        }

        return checkups;
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
          centerTitle: true,
        ),
        //drawer
        drawer: Drawer(
          child: ListView(
            children: [
              //header
              UserAccountsDrawerHeader(
                accountName: Text(firstName + '' + lastName),
                accountEmail: Text(email),
                currentAccountPicture: GestureDetector(
                  child: const CircleAvatar(
                      backgroundColor: Colors.white,
                      backgroundImage: AssetImage("assets/user.png")),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => UserProfile()));
                },
                child: ListTile(
                  title: const Text('My Profile'),
                  leading: Icon(
                    Icons.person,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const UserReport()));
                },
                child: ListTile(
                  title: const Text('My Report'),
                  leading: Icon(
                    Icons.copy,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => const About()));
                },
                child: ListTile(
                  title: const Text('About'),
                  leading: Icon(
                    Icons.help,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ),
              const SizedBox(
                height: 175,
              ),
              const Divider(
                thickness: 1,
              ),
              const SizedBox(
                height: 100,
              ),
              InkWell(
                onTap: () {
                  Navigator.pushReplacement(context,
                      MaterialPageRoute(builder: (context) => signIn()));
                },
                child: ListTile(
                  title: const Text('Logout'),
                  leading: Icon(
                    Icons.logout,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              )
            ],
          ),
        ),
        body: Container(
          decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(30),
                topRight: Radius.circular(30),
              )),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                margin: const EdgeInsets.only(top: 15, left: 20),
                child: Text('Hello ' + firstName,
                    style: GoogleFonts.didactGothic(
                        textStyle: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 30))),
              ),
              Container(
                margin: const EdgeInsets.only(top: 10, left: 20),
                child: Text('Welcome',
                    style: GoogleFonts.didactGothic(
                        textStyle: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20))),
              ),
              Container(
                margin: const EdgeInsets.only(top: 15, left: 20),
                width: size.width,
                child: Stack(
                  fit: StackFit.loose,
                  children: [
                    Container(
                      child: const Text(
                        'Health Department',
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
                  height: 80,
                  margin: const EdgeInsets.only(top: 20, left: 20),
                  child: FutureBuilder(
                    future: getcheckupCategory(),
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
                          scrollDirection: Axis.horizontal,
                          itemBuilder: (context, i) {
                            return healthCategories(
                              snapshot.data[i].name,
                              snapshot.data[i].details,
                              snapshot.data[i].availableDoctors,
                              (checkupImageUrl + snapshot.data[i].checkupIcon),
                              snapshot.data[i].possibleDisease,
                            );
                          },
                        );
                      }
                    },
                  )),
              Container(
                margin: const EdgeInsets.only(top: 25, left: 20),
                width: size.width,
                child: Stack(
                  fit: StackFit.loose,
                  children: [
                    Container(
                      child: const Text(
                        'Room Category',
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
                  height: 130,
                  margin: const EdgeInsets.only(top: 20, left: 20),
                  child: FutureBuilder(
                    future: getroomList(),
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
                          scrollDirection: Axis.horizontal,
                          itemBuilder: (context, i) {
                            return roomCategories(
                                (roomImageUrl + snapshot.data[i].roomImage),
                                snapshot.data[i].name,
                                snapshot.data[i].availablenumber,
                                snapshot.data[i].price,
                                snapshot.data[i].details,
                                snapshot.data[i].id,
                                snapshot.data[i].availablenumber);
                          },
                        );
                      }
                    },
                  )),
              Container(
                margin: const EdgeInsets.only(top: 25, left: 20),
                width: size.width,
                child: Stack(
                  fit: StackFit.loose,
                  children: [
                    Container(
                      child: const Text(
                        'Doctors',
                        style: TextStyle(
                          color: Color(0xff363636),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Ink(
                      child: InkWell(
                        child: Container(
                          margin: const EdgeInsets.only(right: 20, left: 300),
                          child: const Text(
                            'See All',
                            style: TextStyle(
                              color: Color(0xff363636),
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => BookDoctor()));
                        },
                      ),
                    ),
                    Container(
                        height: 120,
                        margin:
                            const EdgeInsets.only(left: 20, right: 20, top: 30),
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
                                  return doctorList(
                                      snapshot.data[i].id,
                                      (doctorImageUrl +
                                          snapshot.data[i].doctorPic),
                                      snapshot.data[i].name,
                                      snapshot.data[i].speciality,
                                      snapshot.data[i].available,
                                      snapshot.data[i].bookedDate);
                                },
                              );
                            }
                          },
                        )),
                  ],
                ),
              ),
            ],
          ),
        ),
        bottomNavigationBar: BottomNavigationBar(
            backgroundColor: Colors.grey[200],
            type: BottomNavigationBarType.fixed,
            selectedItemColor: Theme.of(context).primaryColor,
            iconSize: 25,
            items: [
              const BottomNavigationBarItem(
                  icon: SizedBox(
                    child: Icon(Icons.home),
                    width: 30,
                    height: 30,
                  ),
                  label: "Home Page"),
              BottomNavigationBarItem(
                  icon: SizedBox(
                    child: IconButton(
                        icon: const Icon(
                          Icons.notification_important,
                          color: Colors.red,
                        ),
                        onPressed: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => EmergencyService()));
                        }),
                    width: 30,
                    height: 30,
                  ),
                  label: "Emergency")
            ]));
  }

  Widget emergencynavbar(selectedIndex, data) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 5.0),
      child: Material(
        elevation: 0,
        borderRadius: BorderRadius.circular(20),
        color: Colors.black.withOpacity(0.1),
        child: Container(
          height: 30,
          width: double.infinity,
          child: ListView.builder(
            itemCount: data.length,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemBuilder: (context, i) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    selectedIndex = i;
                    if (i == 0) {
                      Navigator.pop(
                          context,
                          MaterialPageRoute(
                              builder: (context) => EmergencyService()));
                    }
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(microseconds: 250),
                  width: 25,
                  decoration: BoxDecoration(
                    border: i == selectedIndex
                        ? const Border(
                            top: BorderSide(width: 1.5, color: Colors.white))
                        : null,
                  ),
                  child: Icon(
                    data[i],
                    size: 25,
                    color: i == selectedIndex
                        ? Colors.grey.shade800
                        : Colors.grey.shade500,
                  ),
                ),
              ),
            ),
            scrollDirection: Axis.horizontal,
          ),
        ),
      ),
    );
  }

// Health fields
  Widget healthCategories(String name, String details, var availableDoctors,
      String image, var possibleDisease) {
    return GestureDetector(
        onTap: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => CategoryPage(
                      name: name,
                      image: image,
                      details: details,
                      availabledoctors: availableDoctors,
                      possibleDisease: possibleDisease)));
        },
        child: Container(
          margin: const EdgeInsets.only(right: 15),
          width: 180,
          decoration: BoxDecoration(
            color: Theme.of(context).secondaryHeaderColor,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                height: 40,
                child: Image.network(image),
              ),
              Container(
                child: Text(
                  name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ));
  }

// doctor List
  Widget doctorList(String id, String doctorimage, String doctorname,
      String doctorspeciality, var available, var bookedDate) {
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
        height: 70,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.only(left: 20),
              height: 120,
              width: 70,
              child: Image.network(doctorimage),
            ),
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
                        doctorspeciality,
                        style: const TextStyle(color: Colors.grey, fontSize: 8),
                      ),
                    )
                  ]),
            ),
          ],
        ),
      ),
    );
  }

// Room Categories
  Widget roomCategories(
      String image,
      String roomName,
      int roomQuantity,
      String roomPrice,
      String roomDescription,
      String roomId,
      int availablenumber) {
    return GestureDetector(
        onTap: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => BookRoom(
                        roomType: roomName,
                        roomPhoto: image,
                        roomDescription: roomDescription,
                        roomPrice: roomPrice,
                        roomQuantity: roomQuantity,
                        roomId: roomId,
                        availablenumber: availablenumber,
                      )));
        },
        child: Container(
          margin: const EdgeInsets.only(right: 15),
          width: 180,
          decoration: BoxDecoration(
            color: Theme.of(context).secondaryHeaderColor,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                margin: const EdgeInsets.only(top: 2),
                height: 80,
                child: Image.network(image),
              ),
              Container(
                margin: const EdgeInsets.only(top: 5),
                child: Text(
                  roomName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Container(
                margin: const EdgeInsets.only(top: 2),
                padding: const EdgeInsets.all(2),
                child: Text(
                  "Room Quantity: " + roomQuantity.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ));
  }
}
