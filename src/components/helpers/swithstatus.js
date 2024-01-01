import React from "react";

const getStatus = (status) => {
    switch (status) {
        case 0:  
        return 'prospect'
        case 20:
            return 'dnc';
        case 40:
            return 'unqualified';
        case 60:
            return 'meeting';
        case 80:
            return 'negotiation';
        case 100:
            return 'new client';
    }
};

const getStatusNum = (status) => {
          switch (status) {
              case 'prospect':  
                return 0
              case 'dnc':
                  return 20
              case "unqualified":
                  return 40;
              case "meeting":
                  return 60
              case "negotiation":
                  return 80
              case "new client":
                  return 100;
          }
      };


const getStatusColor = (status) => {
        switch (status) {
            case 'dnc':
                return 'help bg-yellow-500';
            case 'unqualified':
                return 'help bg-gray-500';

            case 'new client':
                return 'success';

            case 'prospect':
                return 'primary';

            case 'meeting':
                return 'warning';

            case 'negotiation':
                return 'danger';

        }
    };

const getStatusGraphBackGroundColor = (status) =>{
    switch (status){

            // new client  'rgba(19, 227, 183, 0.2)'
            // prospect  'rgba(11, 98, 252, 0.2)'
            // negotiation 'rgba(217, 79, 133, 0.2)',
            // dnc  'rgba(244, 230, 24, 0.2)',
            // meeting  'rgba(221, 164, 94, 0.2)',
        case 'dnc':
            return 'rgba(244, 230, 24, 0.2)';
        case 'unqualified':
            return 'rgba(47, 75, 54, 0.2)';
        case 'new client':
            return 'rgba(19, 227, 183, 0.2)';
        case 'prospect':
            return 'rgba(11, 98, 252, 0.2)';
        case 'meeting':
            return 'rgba(221, 164, 94, 0.2)';
        case 'negotiation':
            return 'rgba(217, 79, 133, 0.2)';

    }
};

const getStatusGraphHoverBackGroundColor = (status) =>{
    switch (status){
        case 'dnc':
            return 'rgba(244, 230, 24)';
        case 'unqualified':
            return 'rgba(47, 75, 54)';
        case 'new client':
            return 'rgba(19, 227, 183)';
        case 'prospect':
            return 'rgba(11, 98, 252)';
        case 'meeting':
            return 'rgba(221, 164, 94)';
        case 'negotiation':
            return 'rgba(217, 79, 133)';

    }
}

export {getStatus, getStatusNum, getStatusColor, getStatusGraphBackGroundColor, getStatusGraphHoverBackGroundColor}