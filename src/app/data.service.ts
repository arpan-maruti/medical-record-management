import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private mockData = {
    users: [
      {
        _id: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        is_active: true,
        password: 'hashedpassword1',
        country_code: '+1',
        phone_number: '1234567890',
        role_id: 'role1',
        created_by: 'user1',
        modified_by: 'user1',
        created_on: '2025-01-23T10:00:00Z',
        modified_on: '2025-01-23T10:00:00Z',
      },
      {
        _id: 'user2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        is_active: false,
        password: 'hashedpassword2',
        country_code: '+44',
        phone_number: '9876543210',
        role_id: 'role2',
        created_by: 'user1',
        modified_by: 'user2',
        created_on: '2025-01-22T10:00:00Z',
        modified_on: '2025-01-22T10:00:00Z',
      },
    ],
    roles: [
      {
        _id: 'role1',
        role_name: 'Admin',
        created_by: 'user1',
        modified_by: 'user1',
        created_on: '2025-01-23T10:00:00Z',
        modified_on: '2025-01-23T10:00:00Z',
      },
      {
        _id: 'role2',
        role_name: 'User',
        created_by: 'user1',
        modified_by: 'user2',
        created_on: '2025-01-22T10:00:00Z',
        modified_on: '2025-01-22T10:00:00Z',
      },
    ],
    cases: [
      {
      "_id": "case1",
      "parent_id": "null",
      "client_name": "Client ABC",
      "ref_number": "XYZ123",
      "is_deleted": false,
      "date_of_breach": "2025-01-01",
      "created_by": "user1",
      "modified_by": "user2",
      "created_on": "2025-01-23T10:00:00Z",
      "modified_on": "2025-01-23T10:00:00Z",
      "case_uploaded_by": "John Doe",
      "case_status": "status1",
      "files": ["file1", "file2"],
      "parameters": ["param1_inst1", "param2_inst1"]
    },
    {
      "_id": "case2",
      "parent_id": "null",
      "client_name": "Client XYZ",
      "ref_number": "ABC456",
      "is_deleted": false,
      "date_of_breach": "2025-02-01",
      "created_by": "user2",
      "modified_by": "user1",
      "created_on": "2025-01-22T10:00:00Z",
      "modified_on": "2025-01-22T10:00:00Z",
      "case_uploaded_by": "Jane Smith",
      "case_status": "status2",
      "files": ["file3"],
      "parameters": ["param1_inst2"]
    },
    {
      "_id": "subcase1",
      "parent_id": "case1",
      "client_name": "Client ABC - Subcase 1",
      "ref_number": "XYZ123-1",
      "is_deleted": false,
      "date_of_breach": "2025-01-05",
      "created_by": "user1",
      "modified_by": "user1",
      "created_on": "2025-01-24T10:00:00Z",
      "modified_on": "2025-01-24T10:00:00Z",
      "case_uploaded_by": "John Doe",
      "case_status": "status3",
      "files": ["file4"],
      "parameters": ["param1_inst2"]
    },
    {
      "_id": "subcase2",
      "parent_id": "case1",
      "client_name": "Client ABC - Subcase 2",
      "ref_number": "XYZ123-2",
      "is_deleted": false,
      "date_of_breach": "2025-01-06",
      "created_by": "user1",
      "modified_by": "user2",
      "created_on": "2025-01-25T10:00:00Z",
      "modified_on": "2025-01-25T10:00:00Z",
      "case_uploaded_by": "John Doe",
      "case_status": "status4",
      "files": ["file5", "file6"],
      "parameters": ["param1_inst3"]
    }
    
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
          "_id": "param1_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-1 message",
          "significance_level": "High",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "param2_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-2 message",
          "significance_level": "Moderate",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:01:00Z",
          "modified_on": "2025-01-23T10:01:00Z"
        },
        {
          "_id": "param3_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-3 message",
          "significance_level": "Low",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:02:00Z",
          "modified_on": "2025-01-23T10:02:00Z"
        },
        {
          "_id": "param4_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-4 message",
          "significance_level": "High",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:03:00Z",
          "modified_on": "2025-01-23T10:03:00Z"
        },
        {
          "_id": "param5_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-5 message",
          "significance_level": "Moderate",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:04:00Z",
          "modified_on": "2025-01-23T10:04:00Z"
        },
        {
          "_id": "param6_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-6 message",
          "significance_level": "Moderate",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:04:00Z",
          "modified_on": "2025-01-23T10:04:00Z"
        },
        {
          "_id": "param7_inst1",
          "instruction_id": "inst1",
          "parameter_msg": "1-7 message",
          "significance_level": "Moderate",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:04:00Z",
          "modified_on": "2025-01-23T10:04:00Z"
        },
        {
          "_id": "param1_inst2",
          "instruction_id": "inst2",
          "parameter_msg": "2-1 message",
          "significance_level": "High",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-22T10:00:00Z",
          "modified_on": "2025-01-22T10:00:00Z"
        },
        {
          "_id": "param2_inst2",
          "instruction_id": "inst2",
          "parameter_msg": "2-2 message",
          "significance_level": "Moderate",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-22T10:01:00Z",
          "modified_on": "2025-01-22T10:01:00Z"
        },
        {
          "_id": "param3_inst2",
          "instruction_id": "inst2",
          "parameter_msg": "2-3 message",
          "significance_level": "Low",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-22T10:02:00Z",
          "modified_on": "2025-01-22T10:02:00Z"
        },
        {
          "_id": "param4_inst2",
          "instruction_id": "inst2",
          "parameter_msg": "2-4 message",
          "significance_level": "High",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-22T10:03:00Z",
          "modified_on": "2025-01-22T10:03:00Z"
        },
        {
          "_id": "param5_inst2",
          "instruction_id": "inst2",
          "parameter_msg": "2-5 message",
          "significance_level": "Moderate",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-22T10:04:00Z",
          "modified_on": "2025-01-22T10:04:00Z"
        },
        {
          "_id": "param1_inst3",
          "instruction_id": "inst3",
          "parameter_msg": "3-1 message",
          "significance_level": "High",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:00:00Z",
          "modified_on": "2025-01-23T10:00:00Z"
        },
        {
          "_id": "param2_inst3",
          "instruction_id": "inst3",
          "parameter_msg": "3-2 message",
          "significance_level": "Moderate",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:01:00Z",
          "modified_on": "2025-01-23T10:01:00Z"
        },
        {
          "_id": "param3_inst3",
          "instruction_id": "inst3",
          "parameter_msg": "3-3 message",
          "significance_level": "Low",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:02:00Z",
          "modified_on": "2025-01-23T10:02:00Z"
        },
        {
          "_id": "param4_inst3",
          "instruction_id": "inst3",
          "parameter_msg": "3-4 message",
          "significance_level": "High",
          "created_by": "user2",
          "modified_by": "user2",
          "created_on": "2025-01-23T10:03:00Z",
          "modified_on": "2025-01-23T10:03:00Z"
        },
        {
          "_id": "param5_inst3",
          "instruction_id": "inst3",
          "parameter_msg": "3-5 message",
          "significance_level": "Moderate",
          "created_by": "user1",
          "modified_by": "user1",
          "created_on": "2025-01-23T10:04:00Z",
          "modified_on": "2025-01-23T10:04:00Z"
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

  getMainCases(): Array<any> {
    return this.mockData.cases.filter((case1) => case1.parent_id == 'null');
  }

  getSubCases(parentId: string) {
    return this.mockData.cases.filter(
      (subCase) => subCase.parent_id === parentId
    ); // Fetch subcases for a parent case
  }

  getInstructionType(caseItem: any) {
    
    const parameters = this.getParameters();
    const matchingParam = parameters.find(
      (param: any) => param._id === caseItem.parameters[0]
    );

    if (!matchingParam) {
      return null; // or a default value
    }
    console.log('instructionType');
    const instruction = matchingParam.instruction_id;
    const instructionType = this.getInstructionTypes().find(
      (msg: any) => msg._id === instruction
    );

    if (!instructionType) {
      console.error(
        'No matching instruction type found for instruction_id:',
        instruction
      );
      return null; // or a default value
    }
    
    return instructionType.instruction_msg;
  }

  getCases(): Array<any> {
    return this.mockData.cases;
  }

  getCaseStatus(caseItem: any) {
    const status = this.mockData.case_status.find(
      (status: any) => status._id === caseItem.case_status
    );
    return status ? status.status : 'Unknown';
  }

  getOtps(): Array<any> {
    return this.mockData.otps;
  }

  getTotalFiles(caseItem: any) {
    return caseItem.files ? caseItem.files.length : 0; // Count files in the case
  }

  getParameters(): Array<any> {
    return this.mockData.parameters;
  }

  // getParametersByInstructionId(instructionId: string): Array<any> {
  //   return this.mockData.parameters.filter(param => param.instruction_id === instructionId);
  // }

  getLoiTypes(): Array<any> {
    return this.mockData.loi_types;
  }

  getTotalPages(caseItem: any) {
    // return caseItem.files ? caseItem.files.reduce((sum: number, subCase: any) => sum + (subCase.no_of_pages || 0), 0) : 0;
    return 0;
  }

  getInstructionTypes(): Array<any> {
    return this.mockData.instruction_types;
  }

      getCaseUploader(caseItem: any) {
        return caseItem.case_uploaded_by ? caseItem.case_uploaded_by : 'Unknown';
      }
      getParametersByInstructionId(instructionId: string): Array<any> {
        return this.mockData.parameters.filter(param => param.instruction_id === instructionId);
      }
      getInstructionTypesByLoiId(loiId: string): Array<any> {
        return this.mockData.instruction_types.filter(instruction => instruction.loi_id === loiId);
      }

      getStatusLabelById(statusId: string): string {
        const status = this.mockData.case_status.find(s => s._id === statusId);
        return status ? status.status : ''; // Return the status label or empty string if not found
      }
  };