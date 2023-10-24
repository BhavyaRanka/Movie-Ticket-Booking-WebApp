const search = Vue.component("search", {
  template: `
                <div>
                        <div><form class="form-inline">
    <input class="form-control" type="text" placeholder="Search a Location" v-model="Location">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="searchLocation">Search</button>
  </form>
  </div>
  <div class="card my-3 mx-3 col-4" style="width: 18rem;" >
  <div class="card-body">
                                <h5 class="card-title">Search Result</h5>
                                <div class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="post in locationData">
                                <p class="card-text"> <a v-bind:href="'#/theater?name='+ post.theaterName+'&place='+post.theaterPlace">{{post.theaterName}}</a></p>
                                </div>
                                </div>
  </div
  
  </div>
  
  <div><form class="form-inline">
  <input class="form-control" type="text" placeholder="Search a Tag" v-model="Tag">
  <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="searchTag">Search</button>
</form>
</div>
<div class="card my-3 mx-3 col-4" style="width: 18rem;" >
<div class="card-body">
                              <h5 class="card-title">Search Result</h5>
                              <div class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="post in tagData">
                              <p class="card-text"> <a v-bind:href="'#/theater?name='+ post.theaterName+'&place='+post.theaterPlace">{{post.theaterName}}</a></p>
                              </div>
                              </div>
</div

</div>

                        <div><form class="form-inline">
    <input class="form-control" type="text" placeholder="Search a Rating" v-model="Rating">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="searchRating">Search</button>
  </form>
  </div>
  <div class="card my-3 mx-3 col-4" style="width: 18rem;" >
  <div class="card-body">
                                <h5 class="card-title">Search Result</h5>
                                <div class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="post in ratingData">
                                <p class="card-text"> <a v-bind:href="'#/theater?name='+ post.theaterName+'&place='+post.theaterPlace">{{post.theaterName}}</a></p>
                                </div>
                                </div>
  </div>
  
  </div>
           </div>    
    `,
  data: function () {
    return {
      Location: "",
      Tag:"",
      Rating:"",
      locationData:"",
      tagData:"",
      ratingData:""
    };
    },
  methods:{
    searchLocation: function (){
      const data={'value': this.Location}
      fetch(`/searchLocation`,{method:'POST',headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),})
      .then((response) => response.json())
      .then((data) => {
        console.log("Data returned from the backend:", data);
        this.locationData=data;
        if (data.length==0){
          alert("No data Found")
        };
        
	
      });
    },
    searchTag: function (){
      const data={'value': this.Tag}
      fetch(`/searchTag`,{method:'POST',headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),})
      .then((response) => response.json())
      .then((data) => {
        console.log("Data returned from the backend:", data);
        this.tagData=data;
        if (data.length==0){
          alert("No data Found")
        };
       
	
      });
    },
    searchRating: function (){
      const data={'value': this.Rating}
      fetch(`/searchRating`,{method:'POST',headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),})
      .then((response) => response.json())
      .then((data) => {
        console.log("Data returned from the backend:", data);
        this.ratingData=data;
        if (data.length==0){
          alert("No data Found")
        };
       
	
      });
    }
  }
  
  
});

export default search;