import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { QualityService } from 'src/app/main/services/quality.service';
import { MyErrorStateMatcher } from '../../evaluations/evaluations-settings/evaluations-settings.component';
import { QualityListSpecialist, QualityListResponsibleArea } from '../../../models/quality.model';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  panelOpenState = false;
  listBahiasForm: FormGroup;

  listDiffusionForm = new FormArray([]);

  listSpecialistControl = new FormControl(null, [Validators.required]);
  listSpecialistArray = [];
  
  listResponsibleAreasControl  = new FormControl(null, [Validators.required]);
  listResponsibleAreasArray = [];



  matcher = new MyErrorStateMatcher();
  listProblemTypeArray = [];
  listNameBahiaArray = [];

  private subscription = new Subscription();
  user: User;

  isMobile = false;
  containerStyle: any;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private qualityService: QualityService,
    private breakpoint: BreakpointObserver

  ) { }

  ngOnInit(): void {
    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
          this.setHandsetContainer();
        } else {
          this.isMobile = false;
          this.setDesktopContainer();
        }
      })
    )


    this.loading.next(true);
    this.subscription.add(this.auth.user$.subscribe(user => {
      this.user = user;
    }));

    this.subscription.add(
      this.qualityService.getAllQualityListSpecialist().subscribe((resp) => {
        if (resp) {
          this.listSpecialistArray = resp;
        } else {
          this.listSpecialistArray = [];
        }
      })
    );

    

    this.subscription.add(
      this.qualityService.getAllQualityListResponsibleAreas()
      .subscribe((resp) => {
        if (resp) {
          this.listResponsibleAreasArray = resp;
        } else {
          this.listResponsibleAreasArray = [];
        }
      })
    );

    this.loading.next(false);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addListDiffusion(): void {
    this.listDiffusionForm.push(new FormControl(''));
  }
 
  addListSpecialist(): void {
    if (this.listSpecialistControl.valid) {
      const objAux: QualityListSpecialist = {
        id: null,
        specialist: this.listSpecialistControl.value.trim().toLowerCase(),
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) => currentValue.specialist !== objAux.specialist;
      if (this.listSpecialistArray.every(valueIsEquals)) {
        this.listSpecialistArray.push(objAux);
      }
      this.listSpecialistControl.reset();
    }
  }
  async deleteListSpecialist(index: number): Promise<void> {
    if (this.listSpecialistArray[index].id) {
      this.loading.next(true);
      await this.qualityService.deleteQualityListSpecialist(this.listSpecialistArray[index].id);
      this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
        duration: 6000
      });
      this.loading.next(false);
    }

    this.listSpecialistArray.splice(index, 1);
    this.loading.next(false);

  }

  saveListSpecialist(): void {
     try {
       const resp = this.qualityService.addQualityListSpecialist(this.listSpecialistArray, this.user);
       this.loading.next(true);
       this.subscription.add(resp.subscribe(
         batch => {
           if (batch) {
             batch.commit()
               .then(() => {
                 this.loading.next(false);
                 this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                   duration: 6000
                 });
               })
               .catch(err => {
                 this.loading.next(false);
                 this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                   duration: 6000
                 });
               });
           }
         }
       ));
     } catch (error) {
       console.log(error);
       this.loading.next(false);
     }
   }

  addListResponsibleArea(): void {
    if (this.listResponsibleAreasControl.valid) {
      const objAux: QualityListResponsibleArea = {
        id: null,
        responsable: this.listResponsibleAreasControl.value.trim().toLowerCase(),
        createdAt: null,
        createdBy: null,
      };
      const valueIsEquals = (currentValue) => currentValue.responsable !== objAux.responsable;
      if (this.listResponsibleAreasArray.every(valueIsEquals)) {
        this.listResponsibleAreasArray.push(objAux);
      }
      this.listResponsibleAreasControl.reset();
    }
  }
  async deleteListResponsibleArea(index: number): Promise<void> {
    if (this.listResponsibleAreasArray[index].id) {
      this.loading.next(true);
      await this.qualityService.deleteQualityListResponsibleAreas(this.listResponsibleAreasArray[index].id);
      this.snackbar.open('✅ Elemento borrado correctamente', 'Aceptar', {
        duration: 6000
      });
      this.loading.next(false);
    }

    this.listResponsibleAreasArray.splice(index, 1);
    this.loading.next(false);

  }

  saveListResponsibleArea(): void {
     try {
       const resp = this.qualityService.addQualityListResponsibleAreas(this.listResponsibleAreasArray, this.user);
       this.loading.next(true);
       this.subscription.add(resp.subscribe(
         batch => {
           if (batch) {
             batch.commit()
               .then(() => {
                 this.loading.next(false);
                 this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                   duration: 6000
                 });
               })
               .catch(err => {
                 this.loading.next(false);
                 this.snackbar.open('🚨 Hubo un error al crear!', 'Aceptar', {
                   duration: 6000
                 });
               });
           }
         }
       ));
     } catch (error) {
       console.log(error);
       this.loading.next(false);
     }
   }


  setHandsetContainer(): void {
    this.containerStyle = {
      'margin': '30px 24px 30px 24px'
    }
  }

  setDesktopContainer(): void {
    this.containerStyle = {
      'margin': '30px 80px 30px 80px',
    }
  }

}
