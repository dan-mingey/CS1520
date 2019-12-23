from flask import Flask, render_template
from flask_restful import Resource, Api, reqparse
from datetime import datetime

app = Flask(__name__)
api = Api(app)


@app.route("/")
def root_page():
	return render_template("index.html")

parser = reqparse.RequestParser()
parser.add_argument('category_name')
parser.add_argument('monthly_limit')
parser.add_argument('money_spent')
parser.add_argument('name_of_purchase')
parser.add_argument('date_of_purchase')
parser.add_argument('category_of_purchase')
parser.add_argument('purchase_amount')
parser.add_argument('category_to_delete')


CATEGORIES = [{
	'category': "uncategorized",
    'monthly_limit': None,
    'money_spent': 0
}]

PURCHASES = list() 

class Cats(Resource):
    def get(self):
        return CATEGORIES

    def post(self):
        args = parser.parse_args()
        CATEGORIES.append({'category': args['category_name'], 'monthly_limit':args['monthly_limit'], 'money_spent':0})
        return CATEGORIES[-1], 201

    def delete(self):
        args = parser.parse_args()
        category_to_delete = args['category_to_delete']

        for cat in CATEGORIES:
            if cat["category"] == category_to_delete:
                CATEGORIES.remove(cat)

        for p in PURCHASES:
            if p['Category'] == category_to_delete:
               
                p["Category"] == "uncategorized"
               
                #get the date of the purchase
                purchase_date = p["Date of Purchase"]
                purchase_month = purchase_date[5]+purchase_date[6]
                purchase_year = purchase_date[0]+purchase_date[1]+purchase_date[2]+purchase_date[3]
                
                #get the current date
                today = datetime.today()
                month = today.month
                year = today.year
                
                #if the purchase was made this month, add the purchase amount to uncategorized
                if(int(purchase_year) == int(year) and int(purchase_month) == int(month)):
                    CATEGORIES[0]["money_spent"] = CATEGORIES[0]["money_spent"] + p["Purchase Amount"] 

        return CATEGORIES[0], 200

class Purchases(Resource):
    def get(self):
        return PURCHASES

    def post(self):
        args = parser.parse_args()
        PURCHASES.append({'Purchase Name': args['name_of_purchase'], 'Purchase Amount':int(args['purchase_amount']), 'Date of Purchase':args['date_of_purchase'], 'Category':args['category_of_purchase']})

        purchase_date = args["date_of_purchase"]
        purchase_month = purchase_date[5]+purchase_date[6]
        purchase_year = purchase_date[0]+purchase_date[1]+purchase_date[2]+purchase_date[3]
       
        today = datetime.today()
        month = today.month
        year = today.year
        
        if(int(purchase_year) == int(year) and int(purchase_month) == int(month)):
            if(args["category_of_purchase"] != "uncategorized"):
                # if the purchase was made this month, update the category's money_spent variable
                for cat in CATEGORIES:
                    if cat["category"] == args["category_of_purchase"]:
                        cat["money_spent"] = cat["money_spent"] + int(args["purchase_amount"])
                        return cat, 201
            else:
                CATEGORIES[0]["money_spent"] = CATEGORIES[0]["money_spent"] + int(args["purchase_amount"])
                return CATEGORIES[0], 200
        
        else:
            return None, 202
       
        return PURCHASES[-1], 201


api.add_resource(Cats, '/cats')
api.add_resource(Purchases, '/purchases')
    

if __name__ == '__main__':
    app.run(debug=True)