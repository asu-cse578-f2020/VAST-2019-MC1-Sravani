***** Only for the first time ****

install flask

---------------------------------------------------------------------------------------

***** Every time *****

To run the backend open cmd from this folder and type the following command:

flask run

This command will start the backend server on the port 5000

----------------------------------------------------------------------------------------

***** APIs ******** (Will be updated everytime a new api is added)

GET requests:

To get the mean damage for a particular category:

http://localhost:5000/damage/mean/shake_intensity

http://localhost:5000/damage/mean/medical

http://localhost:5000/damage/mean/power

http://localhost:5000/damage/mean/buildings

http://localhost:5000/damage/mean/sewer_and_water

http://localhost:5000/damage/mean/roads_and_bridges



similarly

to get mean for a particular interval:
http://localhost:5000/damage/mean/<string:category>/<string:timestamp1>/<string:timestamp2>


to get entropy for a particular interval:
http://localhost:5000/damage/entropy/<string:category>/<string:timestamp1>/<string:timestamp2>


timestamp is a string in the format 'YYYY-MM-DD HH:MM:SS'. For example, '2020-04-06 00:35:00'

Ex: http://localhost:5000/damage/entropy/power/'2020-04-06 00:35:00'/'2020-04-06 23:40:00'


Use the above urls in the http requests from the js files
