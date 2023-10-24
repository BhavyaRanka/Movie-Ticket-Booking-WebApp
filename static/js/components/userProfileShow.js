const userProfileShow=Vue.component("userProfileShow",{
  props: ['name','place'],
  template: `
            <div> 
            <h1>{{name}},{{place}}</h1>
            
            
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
                    <button type="button" class="card-link"" data-bs-toggle="modal" :data-bs-target="'#post' + post.id">
                    Book Tickets
                    </button>
        
                    <!-- Modal -->
                    <div class="modal fade" style="display: none;" :id="'post' + post.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="postLabel" aria-hidden="true" aria-modal="true" >
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="postLabel">Add Theater</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class = "my-3">
                            
                                <label>
                                
                          Number of tickets : </label>
                                <input v-model = "tickets" type="number">
                            </div>
                            <div class = "my-3">
                                <label> Total :{{post.showPrice*tickets}} </label>
                                
                            </div>
                            
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click = "booktickets(post.id)" class="card-link" :data-bs-target="'#post' + post.id"data-bs-toggle="modal">Submit</button>
                        </div>
                        </div>
                        
                        </div>
                        
</div>
<button @click = "trigger_celery_job"> Trigger a Celery Job </button>
<a href='/download-file'><button>Download your data</button></a>

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
      tickets:""

    };
  },
  methods:{
    booktickets: function (id){
      const data={ tickets: this.tickets,name:this.name,place:this.place };
      fetch(`/booktickets/${id}`,{method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),})
      .then((response) => response.json())
      .then((data) => {alert(data);
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
    
    trigger_celery_job : function () {

      fetch("/trigger-celery-job").then(r => r.json()
      ).then(d => {
        console.log("Celery Task Details:", d);
        let interval = setInterval(() => {
          fetch(`/status/${d.Task_ID}`).then(r => r.json()
          ).then(d => {
              if (d.Task_State === "SUCCESS") {
                console.log("task finished")
                clearInterval(interval);
                window.location.href = "/download-file";
              }
              else {
                console.log("task still executing")
              }
          })
        }, 4000)
      })
    },
    downloadFile : function () {

      fetch("/download-file").then(r => r.json()
      ).then(d => {
        console.log("Celery Task Details:", d);
        let interval = setInterval(() => {
          fetch(`/status/${d.Task_ID}`).then(r => r.json()
          ).then(d => {
              if (d.Task_State === "SUCCESS") {
                console.log("task finished")
                clearInterval(interval);
                window.location.href = "/download-file";
              }
              else {
                console.log("task still executing")
              }
          })
        }, 4000)
      })
    }
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


export default userProfileShow;