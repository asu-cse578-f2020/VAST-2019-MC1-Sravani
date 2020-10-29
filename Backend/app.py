from flask import Flask
import pandas as pd
from preprocessData import get_damage_mean_by_category

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
    print(damage_mean_by_category)
    damage = pd.DataFrame(damage_mean_by_category)
    damage = damage.to_json(orient='records')
    print("------------------------------------------------------")
    print(damage)
    return damage

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)