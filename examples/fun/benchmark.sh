destDir="../../.temp/fun"
mkdir -p $destDir
echo "running slow-fun..."
time . slow-fun.sh $destDir/slow-fun-result.txt
echo "running fast-fun..."
time . fast-fun.sh $destDir/fast-fun-result.txt
echo "Result files are in $destDir"