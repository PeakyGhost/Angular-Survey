import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;
  ordersData = [];

  get ordersFormArray() {
    return this.form.controls.orders as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      orders: new FormArray([], minSelectedCheckboxes(1))
    });

    // async orders
    of(this.getOrders()).subscribe(orders => {
      this.ordersData = orders;
      this.addCheckboxes();
    });

    // synchronous orders
    // this.ordersData = this.getOrders();
    // this.addCheckboxes();
  }

  private addCheckboxes() {
    this.ordersData.forEach(() => this.ordersFormArray.push(new FormControl(false)));
  }

  getOrders() {
    return [{
        topicId: "1001",
        topicName: "Early Childhood Care & Education (ECCE)",
        data: [
            {
                ref: "1.3",
                desc: "A National Curricular and Pedagogical Framework for Early Childhood Care and Education (NCPFECCE)",
                questions: [
                    {
                        question: "Present status in KA",
                        options: [
                            {name: "Satisfactory"},
                            {name: "Needs revamp"},
                            {name: "New program to be impl"}
                        ],
                        textAnswer: "User Text answer",
                        allowTextAnswer: false
                    }
                    // {
                    //     question: "Nature of Implications",
                    //     options: [
                    //         {name: "Administrative"},
                    //         {name: "Pedagogical"},
                    //         {name: "Other"}
                    //     ],
                    //     textAnswer: "User Text answer",
                    //     allowTextAnswer: true
                    // },
                    // {
                    //     question: "Implementation Timeline",
                    //     options: [
                    //       {name: "Short term"},
                    //       {name: "Long term"}
                    //     ],
                    //     textAnswer: "user text Answer",
                    //     allowTextAnswer: true
                    // }
                ]
            }
        ]
      },
    ];
  }

  submit() {
    const selectedOrderIds = this.form.value.orders
      .map((checked, i) => checked ? this.ordersData[i].name : null)
      .filter(v => v !== null);

    console.log(selectedOrderIds);
  }
}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);

    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}
