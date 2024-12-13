import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostViewComponent } from "./components/posts/post-view/post-view.component";
import { PostListComponent } from "./components/posts/post-list/post-list.component";
import { PostFormComponent } from "./components/posts/post-form/post-form.component";

const routes:Routes= [
    {path:'', component:PostListComponent},
    {path:'posts/create', component:PostFormComponent},
    {path:'posts/:code', component:PostViewComponent},
    {path:'posts/edit/:code', component:PostFormComponent},
];

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports:[RouterModule]
})

export class AppRoutingModule{}