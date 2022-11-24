import 'package:flutter/material.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';

class About extends StatefulWidget {
  const About({Key? key}) : super(key: key);

  @override
  State<About> createState() => _AboutState();
}

class _AboutState extends State<About> {
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
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
              height: 100,
              decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30))),
              child: Container(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.only(top: 5, bottom: 8),
                        alignment: Alignment.center,
                        margin: const EdgeInsets.only(bottom: 10),
                        child: const Text(
                          'About',
                          style: TextStyle(
                              fontSize: 30,
                              color: Colors.white,
                              fontWeight: FontWeight.w700),
                        ),
                      ),
                      Center(
                          child: Container(
                        padding: const EdgeInsets.all(5),
                        margin: const EdgeInsets.only(bottom: 10),
                        child: const Text(
                          'Sumeru Hospital',
                          style: TextStyle(color: Colors.white, fontSize: 18),
                        ),
                      )),
                    ]),
              )),
          Container(
            padding: const EdgeInsets.all(20),
            child: Text(
              'With the visionary leadership of Mr. Bharat Maharjan, Sumeru Hospital was established on 2068 B.S. (2011 A.D.) by the Sumeru Group of Organization. The primary aim of Sumeru Hospital is to “make hospital service affordable (for economically poor people as well) but quality and reliable by making hospital services transparencies and making reach to all people who are unable to use the services of hospital”. The Hospital Inauguration Ceremony was held on 2069/09/9 on the presence of Prime Minister  Dr. Baburam Bhattarai',
              style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 20),
            alignment: Alignment.center,
            child: Text(
              'Contact Information',
              style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontSize: 28,
                  fontWeight: FontWeight.bold),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Text(
                    'Sumeru Hospital Pvt. Ltd. ',
                    style: TextStyle(
                        color: Theme.of(context).secondaryHeaderColor,
                        fontSize: 18),
                  ),
                ),
                Container(
                  child: Row(
                    children: [
                      Container(
                        child: Text(
                          'Address :',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      ),
                      Container(
                        child: Text(
                          '  Dhapakhel, Lalitpur, Nepal',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  child: Row(
                    children: [
                      Container(
                        child: Text(
                          'Phone :',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      ),
                      Container(
                        child: Text(
                          '  01-5275377, 01-5275088',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  child: Row(
                    children: [
                      Container(
                        child: Text(
                          'Fax No. :',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      ),
                      Container(
                        child: Text(
                          '  977-1-5003422',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  child: Row(
                    children: [
                      Container(
                        child: Text(
                          'P.O. BOX :',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      ),
                      Container(
                        child: Text(
                          '  15137',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  child: Row(
                    children: [
                      Container(
                        child: Text(
                          'Email :',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      ),
                      Container(
                        child: Text(
                          '  info@sumeruhospital.org.np',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor),
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                    child: ElevatedButton.icon(
                  onPressed: () {
                    FlutterPhoneDirectCaller.callNumber('tel: 01-5275377');
                  },
                  icon: const Icon(Icons.call),
                  label: const Text('Callnow'),
                  style: ElevatedButton.styleFrom(
                    primary: Theme.of(context).primaryColor, // background
                  ),
                )),
              ],
            ),
          )
        ])));
  }
}
