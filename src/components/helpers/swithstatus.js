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

export {getStatus, getStatusNum, getStatusColor}