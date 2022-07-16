import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { orderList, orderTask } from 'src/app/models/orderList.model';
import { packingModel } from 'src/app/models/packingModel.mode';
@Component({
  selector: 'app-packing-dialog',
  templateUrl: './packing-dialog.component.html',
  styleUrls: ['./packing-dialog.component.scss']
})
export class PackingDialogComponent implements OnInit {

  constructor(private appservice: AppService) { }
  testGroup = new FormGroup({})
  ngOnInit(): void {
    this.testGroup = this.appservice.formBuilder.group({
      todo: ['', Validators.required]
    })
  }

  // chooseData(picking: orderList | null) {
  //   let newData: orderList[];

  //   function pushData(data: orderList) {
  //     newData.push(data);
  //   }

  //   function spliceData() {
  //     for (let i = 0; i < newData.length; i++) {
  //       if (picking!.id == newData[i].id) {
  //         newData.splice(i, 1)
  //         break
  //       }
  //     }
  //   }

  //   function get() {
  //     return newData;
  //   }

  //   return {
  //     pushData,
  //     spliceData,
  //     get,
  //   };
  // }

  // setData(data: orderList) {
  //   let add = this.chooseData(null).pushData(data)
  // }

  // removeData(data: orderList) {
  //   this.chooseData(data).spliceData();
  // }

  // getData() {
  //   console.log(this.chooseData(null).get())
  // }

  chooseData() {
    let newData: any[] = []

    function pushData(data: string) {
      newData.push(data);

      return function remove(splice: any) {
        for (let i = 0; i < newData.length; i++) {
          if (splice == newData[i].todo) {
            newData.splice(i, 1)
            break
          }
        }
        console.log(newData);
      }
    }

    function spliceData(splice: string) {
      for (let i = 0; i < newData.length; i++) {
        if (splice == newData[i].todo) {
          newData.splice(i, 1)
          break
        }
      }
      console.log(newData);
    }

    function get() {
      console.log(newData);
    }

    return {
      pushData,
      spliceData,
      get,
    };
  }

  remove = this.chooseData();
  set = this.chooseData()
  get = this.chooseData();
  setData(data: any) {
    this.set.pushData(data)
    this.testGroup.reset()
  }

  removeData(data: any) {
    let remove = this.set.pushData(data);


    remove(data)
  }

  getData() {
    this.get.get()
  }



}

