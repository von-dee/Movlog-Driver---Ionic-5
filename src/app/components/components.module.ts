import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemaddpopoverComponent } from "./itemaddpopover/itemaddpopover.component";





@NgModule({
  declarations: [
    ItemaddpopoverComponent
  ],
  entryComponents: [
    ItemaddpopoverComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ItemaddpopoverComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class ComponentsModule { }

