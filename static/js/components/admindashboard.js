const admindashboard = Vue.component("admindashboard", {
  template: `
                <div><!-- Button trigger modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#post">
                Add Theater
                </button>

                <!-- Modal -->
                    <div class="modal fade" style="display: none;" id="post" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="postLabel" aria-hidden="true" aria-modal="true" >
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="postLabel">Add Theater</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class = "my-3">
                                <label> Enter Theater Name : </label>
                                <input v-model = "theaterName" type="text">
                            </div>
                            <div class = "my-3">
                                <label> Enter Theater Place : </label>
                                <input v-model = "theaterPlace" type="text">
                            </div>
                            
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click = "addtheater" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                        </div>
                        </div>
                        </div>
                        </div>
                        <!-- Button trigger modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#summary">
                Tickets Booked Summary
                </button>

                <!-- Modal -->
                    <div class="modal fade" style="display: none;" id="summary" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="postLabel" aria-hidden="true" aria-modal="true" >
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="postLabel">Summary</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                       <div class="modal-body;" v-for="i in summary">
                           <ul>  <li><div class = "my-3;" >
                                <label>Theater : </label> {{i.theaterName}}
                                
                            </div>
<ul> <li> 
 <div class = "my-3">
                              <label> Total Tickets Booked Today : </label> {{i.totalTickets}}
                                
                            </div></li>
 <li><div class = "my-3">
                                <label> Total Revenue today: </label> {{i.totalRevenue}}
                                
                            </div></li>
                            
                            </ul></li>
</ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                        </div>
                        </div>
                        <div  v-if="feed_data.length">
                       <div class = "row">
                        <div class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="post in feed_data">
                            <div class="card-body">
                                <h5 class="card-title">Theater Name :<a v-bind:href="'#/theater?name='+ post.theaterName+'&place='+post.theaterPlace">{{ post.theaterName }} </a></h5>
                                <!-- <h6 class="card-subtitle mb-2 text-body-secondary">Username :<a v-bind:href="'#/user?user='+ post.username">{{ post.username }} </a>
                                </h6>-->
                                <p class="card-text">{{post.theaterPlace}}</p>
                                <!-- Button trigger modal -->
                                <button type="button" class="card-link" :data-bs-target="'#post' + post.id" data-bs-toggle="modal">
                                    Update Theater
                                </button>
                                <!-- Modal -->
                                <div class="modal fade" :id="'post' + post.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="'postLabel' + post.id" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" :id="'postLabel' + post.id">Update Theater</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class = "my-3">
                                                    <label> Enter Theater Name : </label>
                                                    <input v-model = "theaterName" type="text">
                                                </div>
                                                <div class = "my-3">
                                                    <label> Enter Theater place : </label>
                                                    <input v-model = "theaterPlace" type="text">
                                                </div>
                                            </div>
                                        <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" @click = "update_theater(post.id)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                                </div>
                                <button @click="delete_theater(post.id)" class="card-link">Delete Theater</button>
                                
                                </div>
                                </div>
  </div>
  <div v-else>
  <p> There are no Theater on your feed.</p>
<p> Add Theater using the add theater button</p>
  </div>
                </div>
    `,
data: function (){
  return {
    feed_data:[],
    theaterName:"",
    theaterPlace:"",
    summary:"",
    
  };
},
methods: {
  addtheater: function () {
    const data = { theaterName: this.theaterName, theaterPlace: this.theaterPlace };

    fetch("/createtheater", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetch("/getalltheater")
          .then((response) => response.json())
          .then((data) => {
            console.log("Data returned from the backend:", data);
            this.feed_data = data;
          });
        // this.$router.go(0)
        // this.$router.push("/posts")
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      
  },
  delete_theater: function (id) {
    fetch(`/deletetheater/${id}`)
      .then((r) => r.json())
      .then((d) => {
        console.log(d);
        fetch("/getalltheater ")
          .then((response) => response.json())
          .then((data) => {
            console.log("Data returned from the backend:", data);
            this.feed_data = data;
          });
      });
  },
  update_theater: function (id) {
    const data = { theaterName: this.theaterName, theaterPlace: this.theaterPlace };

    fetch(`/update_theater/${id}`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetch("/getalltheater")
          .then((response) => response.json())
          .then((data) => {
            console.log("Data returned from the backend:", data);
            this.feed_data = data;
          });
        // this.$router.go(0)
        // this.$router.push("/posts")
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },

},
  mounted: function () {
    fetch("/getSummary")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        this.summary = data;
      });
    fetch("/getalltheater")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        this.feed_data = data;
      });
  },
});

export default admindashboard;