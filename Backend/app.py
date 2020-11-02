from flask import Flask
import pandas as pd
from preprocessData import get_damage_mean_by_category, get_mean_by_category, get_entropy_by_category

app = Flask(__name__)

@app.route('/geo-json', methods=['GET'])
def st_himark_geo_json():
    return {
        "type": "Topology",
        "arcs": [],
        "transform": {},
        "objects": {}
    }

@app.route('/damage/mean/<string:category>', methods=['GET'])
def damage_by_category(category):
    damage_mean_by_category = get_damage_mean_by_category(category)
    damage = pd.DataFrame(damage_mean_by_category)
    damage = damage.to_json(orient='records')
    return damage

@app.route('/damage/mean/<string:category>/<string:time1>/<string:time2>', methods=['GET'])
def damage_by_category_for_time_period(category, time1, time2):
    damage_mean_by_category_for_timeframe = get_mean_by_category(category, time1, time2)
    damage = pd.DataFrame(damage_mean_by_category_for_timeframe)
    damage = damage.to_json(orient='records')
    return damage

@app.route('/damage/entropy/<string:category>/<string:time1>/<string:time2>', methods=['GET'])
def entropy_by_category_for_time_period(category, time1, time2):
    entropy_by_category_for_timeframe = get_entropy_by_category(category, time1, time2)
    entropy = pd.DataFrame(entropy_by_category_for_timeframe)
    entropy = entropy.to_json(orient='records')
    return entropy

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)