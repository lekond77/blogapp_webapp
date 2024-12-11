import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostViewComponent } from "./components/posts/post-view/post-view.component";
import { PostListComponent } from "./components/posts/post-list/post-list.component";

const routes:Routes= [
    {path:'', component:PostListComponent},
    {path:'posts/:id', component:PostViewComponent},
];

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports:[RouterModule]
})

export class AppRoutingModule{}