const theaterProfile=Vue.component("theaterProfile",{
  props: ['name','place'],
  template: `
            <div> <h1>{{name}},{{place}}</h1>
            <!-- Button trigger modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#post">
                Add Show
                </button>

                <!-- Modal -->
                    <div class="modal fade" style="display: none;" id="post" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="postLabel" aria-hidden="true" aria-modal="true" >
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="postLabel">Add Theatre</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          
                            <div class = "my-3">
                                <label> Enter Show Name : </label>
                                <input v-model = "showName" type="text">
                            </div>
                            <div class = "my-3">
                                <label> Enter Show Rating : </label>
                                <input v-model = "showRating" type="text">
                            </div>
                            <div class = "my-3">
                                <label> Enter Show Tag : </label>
                                <input v-model = "showTag" type="text">
                            </div>
                            <div class = "my-3">
                                <label> Enter Show Price : </label>
                                <input v-model = "showPrice" type="text">
                            </div>
                            <div class = "my-3">
                                <label> Enter Total Seats : </label>
                                <input v-model = "showTotalSeats" type="text">
                            </div>
                            <div class = "my-3">
                                <label> Enter Available Seats : </label>
                                <input v-model = "showAvailableSeats" type="text">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click = "addshow" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                        </div>
                        </div>
                        </div>
                        </div>
<div class = "row">
                        <div class="card  bg-warning my-3 mx-3 col-4" style="width: 18rem;" v-for="post in posts_data">
                            <div class="card-body">
                                <h5 class="card-title">{{post.showName}}</h5>
                             
                                <p class="card-text">rating :{{post.showRating}}</p>
                                <p class="card-text">Tags:{{post.showTag}}</p>
                                <p class="card-text">Price:{{post.showPrice}}</p>
                                <p class="card-text">Total Seat:{{post.TotalSeats}}</p>
                                <p class="card-text">Available Seat:{{post.availableSeat}}</p>

                                <!-- Button trigger modal -->
                                <button type="button" class="card-link" :data-bs-target="'#post' + post.id" data-bs-toggle="modal">
                                    Update show
                                </button>
                                <!-- Modal -->
                                <div class="modal fade" :id="'post' + post.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="'postLabel' + post.id" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" :id="'postLabel' + post.id">Update show</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class = "my-3">
                                                    <label> Enter Show Name : </label>
                                                    <input v-model = "showName" type="text">
                                                </div>
                                                <div class = "my-3">
                                                    <label> Enter Show rating : </label>
                                                    <input v-model = "showRating" type="text">
                                                </div>
                                                <div class = "my-3">
                                                    <label> Enter Show tag : </label>
                                                    <input v-model = "showTag" type="text">
                                                </div>
                                                <div class = "my-3">
                                                    <label> Enter Show price : </label>
                                                    <input v-model = "showPrice" type="text">
                                                </div>
                                                <div class = "my-3">
                                                    <label> Enter Show total seat : </label>
                                                    <input v-model = "showTotalSeats" type="text">
                                                </div>
                                                <div class = "my-3">
                                                    <label> Enter Show available seat : </label>
                                                    <input v-model = "showAvailableSeats" type="text">
                                                </div>
                                            </div>
                                        <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" @click = "update_show(post.id)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                    <button @click="delete_show(post.id)" class="card-link">Delete Show</button>
</div>
</div>
</div>

                </div>
                </div>
                </div>
                
  `,
  data: function () {
    return {
      posts_data: [],
      showName:"",
      showRating:"",
      showTag:"",
      showPrice:"",
      showTotalSeats:"",
      showAvailableSeats:"",


    };
  },
  methods:{
    addshow: function (){
      const data={ showName: this.showName, showRating: this.showRating,showTag:this.showTag,showPrice:this.showPrice,showTotalSeats:this.showTotalSeats,showAvailableSeats:this.showAvailableSeats };
      fetch(`/createshow?name=${this.name}&place=${this.place}`,{method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),})
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetch(`/getallshow?name=${this.name}&place=${this.place}`)
            .then((response) => response.json())
            .then((data) => {
              console.log("Data returned from the backend:", data);
              this.posts_data = data;
            });
        }).catch((error) => {
          console.error("Error:", error);
        });
    
    },
    delete_show: function (id) {
      fetch(`/deleteshow/${id}`)
        .then((r) => r.json())
        .then((d) => {
          console.log(d);
          fetch(`/getallshow?name=${this.name}&place=${this.place}`)
            .then((response) => response.json())
            .then((data) => {
              console.log("Data returned from the backend:", data);
              this.posts_data = data;
            });
        }).catch((error) => {
          console.error("Error:", error);
        });
    },
    update_show: function (id) {
      const data = {  showName:this.showName,showRating:this.showRating,showTag:this.showTag,showPrice:this.showPrice,showTotalSeats:this.showTotalSeats,showAvailableSeats:this.showAvailableSeats };
  
      fetch(`/update_show/${id}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          fetch(`/getallshow?name=${this.name}&place=${this.place}`)
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
  
  mounted: function (){
   
    let vm = this;
    // console.log(this.query)
    
    fetch(`/getallshow?name=${this.name}&place=${this.place}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data returned from the backend:", data);
        this.posts_data = data;
      });
  }
  
}
  
);

export default theaterProfile;