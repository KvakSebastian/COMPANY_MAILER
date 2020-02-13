  <script>
  // String values; can be used as name, id, or innerHTML
var valsA = <%-JSON.stringify(arr)%>;
var t=<%-JSON.stringify(index)%>;
// Variable to store <option> object
var opt;

// Loop through vals and make an <option> for each one
for(var i=0;i<valsA.length;i++) {
  // Create node
  opt = document.createElement("OPTION");
  // Set innerHTML, if you want
  opt.innerHTML = valsA[i];
  // Set the names to be all the same, if you want
  // Set unique ID, somehow, if you want
  opt.value =  t[i];

  // Finally, append <option> to dropdown menu
  document.getElementById('boot-multiselect-demo').appendChild(opt);
}
  </script>