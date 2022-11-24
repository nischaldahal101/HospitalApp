class CurrentUser {
  var userReports;
  late String id, email, firstname, lastname, password;
  late String version;
  CurrentUser(this.userReports, this.id, this.firstname, this.lastname,
      this.email, this.password, this.version);
}
