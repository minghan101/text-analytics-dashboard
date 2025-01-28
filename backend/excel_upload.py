import os #interact with operting system
import datetime
import pandas as pd
from sqlalchemy import create_engine


ALLOWED_EXTENSIONS = {'xlsx'}

def allowed_file(filename):
    """Check if the uploaded file is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_excels_to_db():
    #Use of online Database MySQL on PHPMyAdmin Database Administrator
    '''
    Host: sql12.freesqldatabase.com
    Database name: sql12759742
    Database user: sql12759742
    Database password: wWZqeLA2tI
    Port number: 3306

    PHPMyAdmin: https://www.phpmyadmin.co/sql.php?server=1&db=sql12759742&table=articles&pos=0
    '''

    start_time = datetime.datetime.now()
    print('Begin:', start_time)
    num=0 #Count the files imported

    #Connect database
    engine = create_engine('mysql+pymysql://sql12759742:wWZqeLA2tI@sql12.freesqldatabase.com:3306/sql12759742?charset=utf8')
    #Database URL: dialect+driver://username:password@host:port/database_name
    path= r'./uploads' #r refers to rowstring

    if not os.path.exists(path):
        print(f"Directory '{path}' not found. Creating it now...")
        os.makedirs(path)

    # Check if directory is now available
    if not os.path.exists(path):
        print(f"Error: The directory '{path}' still doesn't exist.")
        return

    files=os.listdir(path)

    for file in files:
        if allowed_file(file):  # Check if the file is an Excel file
            try:
                # Load the Excel file and upload its content to the database
                file_path = os.path.join(path, file)
                data = pd.read_excel(file_path, header=0)
                data.to_sql(name='articles', con=engine, index=True, if_exists='replace')
                num += 1
                print(f'Imported: {file}')
            except Exception as e:  
                print(f"Failed to process {file}. Error: {e}")
        else:
            print(f"Skipped non-Excel file: {file}")
            
    '''
    for i in files:
        data=pd.read_excel(os.path.join(path,i),header=0)
        data.to_sql(name='articles', con=engine, index=True, if_exists='replace')
        num+=1
        print('Imported:', i)
    '''
    end_time=datetime.datetime.now()
    print('End:', end_time)
    total_time = end_time-start_time
    print('Total Time:', total_time)
    print('Total number of imported files:', num)
    
    return {
        "total_files": num,
        "total_time": total_time
    }
    
if __name__ == "__main__":
    result = upload_excels_to_db()
    print(result)
    
    

'''
# DATABASE CONFIG
DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = "password"
DB_NAME = "ArticlesDB"

# Function to connect to the database
def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        passwd=DB_PASS,
        database=DB_NAME,
        charset="utf8"
    )
    
#Function to fetch the options from database to display in frontend
@app.route('/get-dropdown-options', methods=['GET'])
def get_dropdown_options():
    """Fetches options from the database for the dropdown."""
    con = get_db_connection()
    cur = con.cursor(pymysql.cursors.DictCursor)  # DictCursor - return data as a dictionary

    try:
        # Fetch `Id` and `Text` columns to display as dropdown options
        cur.execute("SELECT Id, Text FROM Article")
        options = cur.fetchall()  # Fetch all rows
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        con.close()

    return jsonify(options), 200

#Function to fetch data based on dropdown selection
@app.route('/get-article-details/<int:article_id>', methods=['GET'])
def get_article_details(article_id):
    """Fetches details for a selected article by its ID."""
    con = get_db_connection()
    cur = con.cursor(pymysql.cursors.DictCursor)

    try:
        # Fetch the article's details based on its ID
        cur.execute("SELECT * FROM Article WHERE Id = %s", (article_id,))
        article = cur.fetchone()  # Fetch a single row
        if not article:
            return jsonify({"error": "Article not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        con.close()

    return jsonify(article), 200


# Setting up database
def set_up_database():
    con = pymysql.connect(host=DB_HOST,
                        user=DB_USER,
                        passwd=DB_PASS,
                        charset='utf8')
    cur = con.cursor()
    
    #Create database if it does not exist
    cur.execute(f'CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8')
    cur.execute(f'USE{DB_NAME}')
    
    #Create Articles Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Article (
            Id INT PRIMARY KEY AUTO_INCREMENT,
            Link VARCHAR(5000),
            Text TEXT
        )
    """)
    con.commit()
    cur.close()
    con.close()

#Get document
def upload_excel(file):
    # Read the Excel file into a DataFrame
    df = pd.read_excel(file)

    # Validate columns
    if "Link" not in df.columns or "Text" not in df.columns:
        raise ValueError("Excel file must contain 'Link' and 'Text' columns.")

    # Connect to the database
    con = get_db_connection()
    cur = con.cursor()

    try:
        # Clear the existing data in the table
        cur.execute("DELETE FROM Article")

        # Insert data into the database
        for _, row in df.iterrows():
            cur.execute(
                "INSERT INTO Article (Link, Text) VALUES (%s, %s)",
                (row["Link"], row["Text"])
            )
        con.commit()
    except Exception as e:
        con.rollback()
        raise e
    finally:
        cur.close()
        con.close()
'''