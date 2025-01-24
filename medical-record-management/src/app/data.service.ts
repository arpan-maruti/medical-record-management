import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private mockData = {
      "users": [
        {
          "_id": "user1",
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@example.com",
          "is_active": true,
          "password": "hashedpassword1",
          "country_code": "+1",
          "phone_number": "1234567890",
          "role_id": "role1",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "user2",
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane.smith@example.com",
          "is_active": false,
          "password": "hashedpassword2",
          "country_code": "+44",
          "phone_number": "9876543210",
          "role_id": "role2",
          "created_by": "user1",
          "modified_by": "user2",
          "created_on": "2025-01-22T10:00:00Z",
          "modified_on": "2025-01-22T10:00:00Z"
        }
      ],
      "roles": [
        {
          "_id": "role1",
          "role_name": "Admin",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "role2",
          "role_name": "User",
          "created_by": "user1",
          "modified_by": "user2",
          "created_on": "2025-01-22T10:00:00Z",
          "modified_on": "2025-01-22T10:00:00Z"
        }
      ],
      "cases": [
        {
          "_id": "case1",
          "parent_id": "user1",
          "client_name": "Client ABC",
          "ref_number": "XYZ123",
          "is_deleted": false,
          "date_of_breach": "2025-01-01",
          "created_by": "user1",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z",
          "case_status": "status1",
          "files": ["file1", "file2"],
          "parameters": ["param1", "param2"]
        },
        // {
        //   "_id": "case2",
        //   "parent_id": "user2",
        //   "client_name": "Client XYZ",
        //   "ref_number": "ABC456",
        //   "is_deleted": false,
        //   "date_of_breach": "2025-02-01",
        //   "created_by": "user2",
        //   "modified_by": "user1",
        //   "created_on": "2025-01-22T10:00:00Z",
        //   "modified_on": "2025-01-22T10:00:00Z",
        //   "case_status": "status2",
        //   "parameters": ["param2"]
        // }
      ],
      "case_status": [
        {
          "_id": "status1",
          "status": "Open",
          "created_by": "user1",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "status2",
          "status": "Closed",
          "created_by": "user2",
          "modified_by": "user1",
          "created_on": "2025-01-22T10:00:00Z",
          "modified_on": "2025-01-22T10:00:00Z"
        }
      ],
      "otps": [
        {
          "_id": "otp1",
          "user_id": "user1",
          "otp_code": "123456",
          "created_on": "2025-01-23T10:00:00Z",
          "expiry_time": "2025-01-23T11:00:00Z"
        },
        {
          "_id": "otp2",
          "user_id": "user2",
          "otp_code": "654321",
          "created_on": "2025-01-22T10:00:00Z",
          "expiry_time": "2025-01-22T11:00:00Z"
        }
      ],
      "files": [
        {
          "_id": "file1",
          "file_name": "Document1.pdf",
          "file_size": 200,
          "no_of_pages": 10,
          "files_label": "Important",
          "is_deleted": false,
          "modified_by": "user1",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "file2",
          "file_name": "Document2.pdf",
          "file_size": 300,
          "no_of_pages": 15,
          "files_label": "Confidential",
          "is_deleted": false,
          "modified_by": "user2",
          "created_on": "2025-01-22T10:00:00Z",
          "modified_on": "2025-01-22T10:00:00Z"
        }
      ],
      "parameters": [
        {
          "_id": "param1",
          "instruction_id": "inst1",
          "parameter_msg": "Parameter 1 description",
          "significance_level": "High",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "param2",
          "instruction_id": "inst2",
          "parameter_msg": "Parameter 2 description",
          "significance_level": "Moderate",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-22T10:00:00Z",
          "modified_on": "2025-01-22T10:00:00Z"
        }
      ],
          "loi_types": [
            {
              "_id": "loi1",
              "loi_msg": "Clinical Negligence",
              "created_by": "user1",
              "modified_by": "user1",
              "created_on": "2025-01-23T10:00:00Z",
              "modified_on": "2025-01-23T10:00:00Z"
            },
            {
              "_id": "loi2",
              "loi_msg": "Personal Injury",
              "created_by": "user2",
              "modified_by": "user2",
              "created_on": "2025-01-22T10:00:00Z",
              "modified_on": "2025-01-22T10:00:00Z"
            }
          ],
          "instruction_types": [
            {
              "_id": "inst1",
              "instruction_msg": "Liability / Breach of Duty",
              "loi_id": "loi1", 
              "created_by": "user1",
              "modified_by": "user1",
              "created_on": "2025-01-23T10:00:00Z",
              "modified_on": "2025-01-23T10:00:00Z"
            },
            {
              "_id": "inst2",
              "instruction_msg": "Liability / Breach of Duty and Causation (combined)",
              "loi_id": "loi1",
              "created_by": "user1",
              "modified_by": "user1",
              "created_on": "2025-01-23T10:00:00Z",
              "modified_on": "2025-01-23T10:00:00Z"
            },
            {
              "_id": "inst3",
              "instruction_msg": "Personal Injury",
              "loi_id": "loi2",
              "created_by": "user2",
              "modified_by": "user2",
              "created_on": "2025-01-22T10:00:00Z",
              "modified_on": "2025-01-22T10:00:00Z"
            }
          ]
      }
      
      constructor() {}
      getUsers(): Array<any> {
        return this.mockData.users;
      }
    
      getRoles(): Array<any> {
        return this.mockData.roles;
      }
    
      getCases(): Array<any> {
        return this.mockData.cases;
      }
    
      getCaseStatus(): Array<any> {
        return this.mockData.case_status;
      }
    
      getOtps(): Array<any> {
        return this.mockData.otps;
      }
    
      getFiles(): Array<any> {
        return this.mockData.files;
      }
    
      getParameters(): Array<any> {
        return this.mockData.parameters;
      }
    
      getLoiTypes(): Array<any> {
        return this.mockData.loi_types;
      }
    
      getInstructionTypes(): Array<any> {
        return this.mockData.instruction_types;
      }
  };